import { Link, useNavigate } from 'react-router-dom'
import { EditIcon, Trash2Icon, GraduationCap } from 'lucide-react'
import { useStudentStore } from '../store/useStudentStore';
import { useUser } from '@clerk/clerk-react';

function StudentCard({ student }) {
  const { deleteStudent } = useStudentStore();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  const imageUrl = student.image_data || student.image || DEFAULT_IMAGE;

  const handleDeleteClick = (e) => {
    e.preventDefault();
    document.getElementById(`delete_modal_${student.id}`).showModal();
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/student/${student.id}`);
  };

  const handleConfirmDelete = () => {
    deleteStudent(student.id);
    document.getElementById(`delete_modal_${student.id}`).close();
  };

  return (
    <>
      <Link
        to={`/student/${student.id}`}
        className='group relative bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-base-300 hover:border-primary/50 flex flex-col h-full'
      >
        {/* Alumni Badge - Top Right Corner */}
        <div className='absolute top-4 right-4 z-10'>
          <div className='badge badge-primary badge-lg gap-2 shadow-md font-semibold'>
            <GraduationCap className='size-4' />
            Alumni
          </div>
        </div>

        {/* Profile Image - Circular */}
        <div className='flex justify-center pt-8 pb-4 bg-gradient-to-br from-primary/5 to-secondary/5'>
          <div className='avatar'>
            <div className='w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 group-hover:ring-offset-2 transition-all duration-300'>
              <img
                src={imageUrl}
                alt={student.name}
                className='object-cover'
              />
            </div>
          </div>
        </div>

        {/* Card Body - Fixed height for consistency */}
        <div className='card-body px-6 pb-6 pt-4 flex-1 flex flex-col'>
          {/* Student Name */}
          <h2 className='card-title text-xl font-bold text-center justify-center mb-3 line-clamp-1'>
            {student.name}
          </h2>

          {/* Description Section with styled label */}
          <div className='flex-1 flex flex-col'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>
              <span className='text-xs font-semibold text-primary uppercase tracking-wider'>About</span>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent'></div>
            </div>

            {/* Description Content */}
            <div
              className='text-sm text-base-content/80 line-clamp-3 prose prose-sm max-w-none overflow-hidden italic leading-relaxed'
              dangerouslySetInnerHTML={{ __html: student.description || "No description available." }}
            />
          </div>

          {/* Card Actions - Only show to authenticated users */}
          {isSignedIn && (
            <div className='card-actions justify-center gap-2 mt-4 pt-4 border-t border-base-300'>
              <button
                className='btn btn-sm btn-info btn-outline gap-2 hover:scale-105 transition-transform'
                onClick={handleEditClick}
              >
                <EditIcon className='size-4' />
                Edit
              </button>
              <button
                className='btn btn-sm btn-error btn-outline gap-2 hover:scale-105 transition-transform'
                onClick={handleDeleteClick}
              >
                <Trash2Icon className='size-4' />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Hover Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
      </Link>

      {/* DELETE CONFIRMATION MODAL */}
      <dialog id={`delete_modal_${student.id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Student</h3>
          <p className="py-4">
            Are you sure you want to delete <span className="font-semibold text-error">{student.name}</span>? This action cannot be undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button onClick={handleConfirmDelete} className="btn btn-error">
              <Trash2Icon className="size-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default StudentCard