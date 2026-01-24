import { DollarSignIcon, ImageIcon, Package2Icon, PlusCircleIcon, UploadIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useState, useRef } from "react";

function AddProductModal() {
  const { addProduct, formData, setFormData, loading, resetForm } = useProductStore();
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set maximum dimensions (reduced for higher compression)
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 1280;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with higher compression (0.7 quality for ~50% size reduction)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Canvas is empty'));
              }
            },
            'image/jpeg',
            0.7 // Compression quality (0-1) - Lower value = smaller file size
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress the image
        const compressedFile = await compressImage(file);

        // Check compressed file size (5MB = 5 * 1024 * 1024 bytes)
        const maxSize = 5 * 1024 * 1024;
        const originalSizeKB = (file.size / 1024).toFixed(2);
        const compressedSizeKB = (compressedFile.size / 1024).toFixed(2);

        console.log(`Image compressed: ${originalSizeKB}KB -> ${compressedSizeKB}KB (${((1 - compressedFile.size / file.size) * 100).toFixed(1)}% reduction)`);

        if (compressedFile.size > maxSize) {
          alert("Compressed image is still larger than 5MB. Please choose a smaller image.");
          e.target.value = null;
          return;
        }

        setSelectedFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error processing image. Please try another file.');
        e.target.value = null;
      }
    }
  };

  const handleToggleChange = (checked) => {
    setUseFileUpload(checked);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ ...formData, image: "" });
  };

  const handleResetForm = () => {
    resetForm();
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseFileUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    await addProduct(e, selectedFile);
    // Clear local state after successful submission
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseFileUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box">
        {/* CLOSE BUTTON */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleResetForm}>X</button>
        </form>

        {/* MODAL HEADER */}
        <h3 className="font-bold text-xl mb-4">Add New Product</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* PRODUCT NAME INPUT */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Product Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Package2Icon className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* PRODUCT PRICE INPUT */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Price</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <DollarSignIcon className="size-5" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            {/* PRODUCT IMAGE */}
            <div className="form-control">
              <label className="label justify-between">
                <span className="label-text text-base font-medium">Product Image</span>
                <div className="flex items-center gap-2">
                  <span className="label-text text-sm">Upload by URL</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={useFileUpload}
                    onChange={(e) => handleToggleChange(e.target.checked)}
                  />
                </div>
              </label>

              {useFileUpload ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                    <ImageIcon className="size-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input file-input-bordered file-input-primary w-full"
                    />
                  </div>
                  {previewUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-base-300">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MODAL ACTIONS */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { document.getElementById('add_product_modal').close(); handleResetForm() }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.name || !formData.price || (!formData.image && !selectedFile) || loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleResetForm}>close</button>
      </form>
    </dialog>
  );
}
export default AddProductModal;