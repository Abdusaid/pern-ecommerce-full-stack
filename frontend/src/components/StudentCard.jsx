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

  // Check if description exists and is not empty
  const hasDescription = student.description &&
                         student.description.trim() !== '' &&
                         student.description !== '<p></p>';

  return (
    <>
      <Link
        to={`/student/${student.id}`}
        className={`group relative bg-gradient-to-br from-base-100 to-base-200/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border-2 border-base-300/50 hover:border-primary/40 flex flex-col ${hasDescription ? 'h-full' : 'h-auto'} hover:-translate-y-1`}
      >
        {/* Decorative gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

        {/* Alumni Badge - Top Right Corner */}
        <div className='absolute top-3 right-3 z-10'>
          <div className='badge badge-primary gap-1.5 shadow-lg font-bold text-xs px-3 py-3 border border-primary-content/10'>
            <GraduationCap className='size-4' />
            <span>Top Graduate</span>
          </div>
        </div>

        {/* Profile Image Section */}
        <div className={`relative flex justify-center bg-gradient-to-br from-primary/8 via-primary/4 to-secondary/8 ${hasDescription ? 'pt-10 pb-6' : 'pt-8 pb-4'}`}>
          {/* Decorative circles behind avatar */}
          <div className='absolute inset-0 flex items-center justify-center opacity-20'>
            <div className='w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl' />
          </div>

          <div className='avatar relative z-10'>
            <div className={`rounded-full ring-4 ring-primary/30 ring-offset-base-100 ring-offset-2 group-hover:ring-primary/60 group-hover:ring-offset-4 transition-all duration-500 shadow-2xl ${hasDescription ? 'w-32 h-32' : 'w-28 h-28'} group-hover:scale-105`}>
              <img
                src={imageUrl}
                alt={student.name}
                className='object-cover'
              />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className={`card-body relative z-10 ${hasDescription ? 'px-6 pb-6 pt-4 flex-1' : 'px-6 pb-5 pt-3'} flex flex-col`}>
          {/* Student Name */}
          <h2 className={`card-title text-base font-bold text-center justify-center line-clamp-1 group-hover:text-primary transition-colors duration-300 ${hasDescription ? 'mb-3' : 'mb-0'}`}>
            {student.name}
          </h2>

          {/* Description Section */}
          {hasDescription && (
            <div className='flex-1 flex flex-col space-y-3'>
              <div className='flex items-center gap-2'>
                <div className='h-0.5 flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full'></div>
                <span className='text-[10px] font-bold text-primary/70 uppercase tracking-widest'>About</span>
                <div className='h-0.5 flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full'></div>
              </div>

              {/* Description Content */}
              <div
                className='text-sm text-base-content/70 line-clamp-3 prose prose-sm max-w-none overflow-hidden leading-relaxed'
                dangerouslySetInnerHTML={{ __html: student.description }}
              />
            </div>
          )}

          {/* Card Actions */}
          {isSignedIn && (
            <div className='card-actions justify-center gap-2 mt-auto pt-4 border-t border-base-300/60'>
              <button
                className='btn btn-xs btn-ghost gap-1.5 hover:btn-info transition-all duration-300 group/edit'
                onClick={handleEditClick}
              >
                <EditIcon className='size-3.5 group-hover/edit:rotate-12 transition-transform' />
                <span className='text-xs'>Edit</span>
              </button>
              <button
                className='btn btn-xs btn-ghost gap-1.5 hover:btn-error transition-all duration-300 group/delete'
                onClick={handleDeleteClick}
              >
                <Trash2Icon className='size-3.5 group-hover/delete:scale-110 transition-transform' />
                <span className='text-xs'>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Shimmer effect on hover */}
        <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none' />
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