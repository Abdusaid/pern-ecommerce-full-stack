import { useNavigate, useParams } from "react-router-dom";
import { useStudentStore } from "../store/useStudentStore";
import { useEffect, useState, useRef } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon, CameraIcon, XIcon, GraduationCap, SparklesIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import TiptapEditor from "../components/TiptapEditor";

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

  const handleDeleteImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ ...formData, image: "", image_data: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* BACK BUTTON */}
        <button
          onClick={handleBackClick}
          className="btn btn-ghost gap-2 mb-8 hover:gap-3 transition-all group"
        >
          <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to List
        </button>

        {/* MAIN CARD */}
        <div className="card bg-gradient-to-br from-base-100 to-base-200/50 shadow-2xl overflow-hidden border-2 border-base-300/50">
          {/* ENHANCED GRADIENT HEADER WITH PATTERN */}
          <div className="relative h-48 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-secondary/90"></div>

            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
            </div>

            {/* Top Graduate Badge */}
            <div className="absolute top-6 right-6">
              <div className="badge badge-lg gap-2 bg-white/20 backdrop-blur-md border-white/40 text-white font-bold px-4 py-4 shadow-xl">
                <GraduationCap className="size-5" />
                <span>Top Graduate</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-base-100 to-transparent"></div>
          </div>

          <div className="card-body -mt-24 relative px-6 md:px-10 pb-10">
            {/* HEADER SECTION WITH AVATAR AND NAME SIDE BY SIDE */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-center mb-10">
              {/* PROFILE PICTURE SECTION - LEFT SIDE */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  {/* Decorative glow behind avatar */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl scale-110 -z-10"></div>

                  {/* CIRCULAR PROFILE PICTURE */}
                  <div className="avatar relative">
                    <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full ring-6 sm:ring-8 ring-base-100 shadow-2xl group-hover:ring-primary/30 transition-all duration-500">
                      <img
                        src={imageUrl}
                        alt={currentStudent?.name}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* CAMERA ICON OVERLAY */}
                  {isSignedIn && !useFileUpload && (
                    <div
                      className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 bg-gradient-to-br from-primary to-primary/80 rounded-full p-2.5 sm:p-3 shadow-xl cursor-pointer hover:scale-110 hover:rotate-12 transition-all duration-300 border-3 sm:border-4 border-base-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CameraIcon className="size-4 sm:size-5 text-primary-content" />
                    </div>
                  )}

                  {/* DELETE IMAGE BUTTON */}
                  {isSignedIn && imageUrl !== DEFAULT_IMAGE && (
                    <div
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-gradient-to-br from-error to-error/80 rounded-full p-2.5 sm:p-3 shadow-xl cursor-pointer hover:scale-110 hover:rotate-12 transition-all duration-300 border-3 sm:border-4 border-base-100"
                      onClick={handleDeleteImage}
                      title="Remove image"
                    >
                      <XIcon className="size-4 sm:size-5 text-error-content" />
                    </div>
                  )}
                </div>
              </div>

              {/* STUDENT NAME AND INFO - RIGHT SIDE */}
              <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4 min-w-0 w-full md:w-auto">
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent leading-tight px-4 md:px-0">
                    {currentStudent?.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap px-4 md:px-0">
                    <div className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-primary/40"></div>
                    <SparklesIcon className="size-3.5 sm:size-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Distinguished Alumni</span>
                    <SparklesIcon className="size-3.5 sm:size-4 flex-shrink-0" />
                    <div className="h-px w-6 sm:w-8 bg-gradient-to-l from-transparent to-primary/40"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIEW/EDIT FORM */}
            {isSignedIn ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStudent(id, selectedFile);
                }}
                className="space-y-8 w-full"
              >
                {/* Decorative divider */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/50"></div>
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">Edit Details</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/50"></div>
                </div>

                {/* STUDENT NAME INPUT */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-bold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                      Student Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student name"
                    className="input input-bordered w-full focus:input-primary transition-all duration-200 bg-base-200/50 backdrop-blur-sm text-lg"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* STUDENT DESCRIPTION */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-bold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                      Description
                    </span>
                  </label>
                  <TiptapEditor
                    content={formData.description || ""}
                    onChange={(html) => setFormData({ ...formData, description: html })}
                    placeholder="Tell us about this student's achievements and journey..."
                  />
                </div>

                {/* STUDENT IMAGE UPLOAD */}
                <div className="form-control">
                  <label className="label justify-between">
                    <span className="label-text text-base font-bold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                      Profile Picture
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="label-text text-sm font-semibold opacity-70">Upload by URL</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
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
                      className="input input-bordered w-full focus:input-primary transition-all duration-200 bg-base-200/50 backdrop-blur-sm"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          key="file-input"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="file-input file-input-bordered file-input-primary w-full bg-base-200/50 backdrop-blur-sm flex-1"
                        />
                        {(previewUrl || selectedFile) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="btn btn-error btn-outline gap-2 hover:scale-105 transition-all"
                            title="Remove selected file"
                          >
                            <XIcon className="size-4" />
                            Clear
                          </button>
                        )}
                      </div>
                      {previewUrl && (
                        <div className="relative w-full max-w-sm mx-auto">
                          <div className="rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-64 object-cover"
                            />
                          </div>
                          <div className="absolute top-2 right-2">
                            <div className="badge badge-primary gap-1 shadow-lg">
                              <SparklesIcon className="size-3" />
                              Preview
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <label className="label">
                    <span className="label-text-alt opacity-60 font-semibold">Maximum file size: 5MB • Supported formats: JPG, PNG, GIF</span>
                  </label>
                </div>

                {/* DIVIDER */}
                <div className="divider my-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-base-content/50 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                    Actions
                    <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                  </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="btn btn-error gap-2 w-full sm:w-auto hover:scale-105 transition-all shadow-lg group"
                  >
                    <Trash2Icon className="size-4 group-hover:rotate-12 transition-transform" />
                    Delete Student
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary gap-2 w-full sm:w-auto hover:scale-105 transition-all shadow-xl group bg-gradient-to-r from-primary to-primary/90"
                    disabled={loading || !formData.name || !formData.description}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4 group-hover:scale-110 transition-transform" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* READ-ONLY VIEW FOR NON-AUTHENTICATED USERS */
              <div className="space-y-8 w-full">
                {/* Decorative divider */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/50"></div>
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-widest">Student Profile</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/50"></div>
                </div>

                {/* STUDENT NAME */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-bold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                      Student Name
                    </span>
                  </label>
                  <div className="p-5 bg-gradient-to-br from-base-200/80 to-base-200/50 backdrop-blur-sm rounded-xl text-lg font-semibold border-2 border-base-300/50 shadow-inner">
                    {currentStudent?.name}
                  </div>
                </div>

                {/* STUDENT DESCRIPTION */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-bold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                      About
                    </span>
                  </label>
                  <div
                    className="p-6 bg-gradient-to-br from-base-200/80 to-base-200/50 backdrop-blur-sm rounded-xl min-h-48 prose prose-base max-w-none border-2 border-base-300/50 shadow-inner leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentStudent?.description || "<p class='text-base-content/50 italic'>No description available</p>" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <dialog id="delete_confirm_modal" className="modal">
        <div className="modal-box border-4 border-error/30 bg-gradient-to-br from-base-100 to-base-200 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-error/10 rounded-full">
              <Trash2Icon className="size-6 text-error" />
            </div>
            <h3 className="font-bold text-2xl">Delete Student</h3>
          </div>

          <div className="bg-error/5 border-l-4 border-error p-4 rounded-lg my-6">
            <p className="text-base leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-error text-lg">{currentStudent?.name}</span>?
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-base-content/70">
              <div className="w-1.5 h-1.5 rounded-full bg-error"></div>
              <span className="font-semibold">This action cannot be undone</span>
            </div>
          </div>

          <div className="modal-action mt-8">
            <form method="dialog">
              <button className="btn btn-ghost mr-3 hover:scale-105 transition-transform">Cancel</button>
            </form>
            <button
              onClick={handleConfirmDelete}
              className="btn btn-error gap-2 hover:scale-105 transition-transform shadow-lg group"
            >
              <Trash2Icon className="size-4 group-hover:rotate-12 transition-transform" />
              Delete Permanently
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
