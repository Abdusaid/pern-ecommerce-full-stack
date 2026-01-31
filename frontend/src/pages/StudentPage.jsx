import { useNavigate, useParams } from "react-router-dom";
import { useStudentStore } from "../store/useStudentStore";
import { useEffect, useState, useRef } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon, CameraIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

function StudentPage() {
  const {
    currentStudent,
    formData,
    setFormData,
    loading,
    error,
    fetchStudent,
    updateStudent,
    deleteStudent,
    clearCurrentStudent,
    setNavigating,
  } = useStudentStore();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStudent(id);
    // Cleanup function to reset all state when leaving the page
    return () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUseFileUpload(false);
      clearCurrentStudent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Removed redirect - allow non-signed-in users to view student details

  const handleBackClick = () => {
    // Set navigating flag and clear state immediately before navigation to prevent flickering
    setNavigating(true);
    clearCurrentStudent();
    setSelectedFile(null);
    setPreviewUrl(null);
    setUseFileUpload(false);
    navigate("/");
  };

  const handleDeleteClick = () => {
    document.getElementById('delete_confirm_modal').showModal();
  };

  const handleConfirmDelete = async () => {
    await deleteStudent(id);
    document.getElementById('delete_confirm_modal').close();
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Image size must be less than 5MB");
        e.target.value = null;
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleChange = (checked) => {
    setUseFileUpload(checked);
    setSelectedFile(null);
    setPreviewUrl(null);
    // Ensure formData.image is always defined to prevent uncontrolled input warning
    if (checked && !formData.image) {
      setFormData({ ...formData, image: "" });
    }
  };

  const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  const imageUrl = previewUrl || currentStudent?.image_data || currentStudent?.image || DEFAULT_IMAGE;

  // Show loading if: 1) loading state is true, 2) no current student, or 3) student ID doesn't match URL ID
  if (loading || !currentStudent || currentStudent.id !== parseInt(id)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* BACK BUTTON */}
        <button
          onClick={handleBackClick}
          className="btn btn-ghost gap-2 mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Students
        </button>

        {/* MAIN CARD */}
        <div className="card bg-base-100 shadow-2xl overflow-hidden">
          {/* GRADIENT HEADER */}
          <div className="bg-gradient-to-r from-primary to-secondary h-32 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </div>

          <div className="card-body -mt-20 relative">
            {/* PROFILE PICTURE SECTION */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                {/* CIRCULAR PROFILE PICTURE */}
                <div className="avatar">
                  <div className="w-40 h-40 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 shadow-xl">
                    <img
                      src={imageUrl}
                      alt={currentStudent?.name}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* CAMERA ICON OVERLAY - Only show for authenticated users */}
                {isSignedIn && (
                  <div
                    className="absolute bottom-2 right-2 bg-primary rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraIcon className="size-5 text-primary-content" />
                  </div>
                )}
              </div>

              {/* STUDENT NAME DISPLAY */}
              <h2 className="text-3xl font-bold mt-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {currentStudent?.name}
              </h2>
            </div>

            {/* VIEW/EDIT FORM */}
            {isSignedIn ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStudent(id, selectedFile);
                }}
                className="space-y-6 max-w-2xl mx-auto w-full"
              >
                {/* STUDENT NAME INPUT */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-semibold flex items-center gap-2">
                      <span className="text-primary">✦</span>
                      Student Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student name"
                    className="input input-bordered w-full focus:input-primary transition-all duration-200 bg-base-200"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* STUDENT DESCRIPTION */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-semibold flex items-center gap-2">
                      <span className="text-primary">✦</span>
                      Description
                    </span>
                  </label>
                  <textarea
                    placeholder="Tell us about this student..."
                    className="textarea textarea-bordered w-full h-32 resize-none focus:textarea-primary transition-all duration-200 bg-base-200"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* STUDENT IMAGE UPLOAD */}
                <div className="form-control">
                  <label className="label justify-between">
                    <span className="label-text text-base font-semibold flex items-center gap-2">
                      <span className="text-primary">✦</span>
                      Profile Picture
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="label-text text-sm opacity-70">Use URL</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={useFileUpload}
                        onChange={(e) => handleToggleChange(e.target.checked)}
                      />
                    </div>
                  </label>

                  {useFileUpload ? (
                    <input
                      key="url-input"
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      className="input input-bordered w-full focus:input-primary transition-all duration-200 bg-base-200"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  ) : (
                    <input
                      key="file-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input file-input-bordered file-input-primary w-full bg-base-200"
                    />
                  )}
                  <label className="label">
                    <span className="label-text-alt opacity-60">Max size: 5MB</span>
                  </label>
                </div>

                {/* DIVIDER */}
                <div className="divider"></div>

                {/* FORM ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="btn btn-error btn-outline gap-2 w-full sm:w-auto hover:scale-105 transition-transform"
                  >
                    <Trash2Icon className="size-4" />
                    Delete Student
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary gap-2 w-full sm:w-auto hover:scale-105 transition-transform shadow-lg"
                    disabled={loading || !formData.name || !formData.description}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* READ-ONLY VIEW FOR NON-AUTHENTICATED USERS */
              <div className="space-y-6 max-w-2xl mx-auto w-full">
                {/* STUDENT NAME */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-semibold flex items-center gap-2">
                      <span className="text-primary">✦</span>
                      Student Name
                    </span>
                  </label>
                  <div className="p-4 bg-base-200 rounded-lg text-base">
                    {currentStudent?.name}
                  </div>
                </div>

                {/* STUDENT DESCRIPTION */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-semibold flex items-center gap-2">
                      <span className="text-primary">✦</span>
                      Description
                    </span>
                  </label>
                  <div className="p-4 bg-base-200 rounded-lg text-base whitespace-pre-wrap min-h-32">
                    {currentStudent?.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <dialog id="delete_confirm_modal" className="modal">
        <div className="modal-box border-2 border-error">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <Trash2Icon className="size-5 text-error" />
            Delete Student
          </h3>
          <p className="py-6 text-base">
            Are you sure you want to delete{" "}
            <span className="font-bold text-error">{currentStudent?.name}</span>?
            <br />
            <span className="text-sm opacity-70 mt-2 block">This action cannot be undone.</span>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button onClick={handleConfirmDelete} className="btn btn-error gap-2">
              <Trash2Icon className="size-4" />
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
export default StudentPage;
