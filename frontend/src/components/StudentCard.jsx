import { Link, useNavigate } from 'react-router-dom'
import { EditIcon, Trash2Icon } from 'lucide-react'
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
      <Link to={`/student/${student.id}`} className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer'>
        {/*STUDENT IMAGE */}
        <figure className='relative pt-[56.25%]'>
          <img
            src={imageUrl}
            alt={student.name}
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
        </figure>

        <div className='card-body'>
          {/*STUDENT INFO */}
          <h2 className='card-title text-lg font-semibold'>{student.name}</h2>
          <p className='text-sm text-base-content/70 line-clamp-3'>{student.description}</p>
          {/*CARD ACTIONS - Only show to authenticated users */}
          {isSignedIn && (
            <div className='card-actions justify-end mt-4'>
              <button
                className='btn btn-sm btn-info btn-outline'
                onClick={handleEditClick}
              >
                <EditIcon className='size-4' />
              </button>
              <button
                className='btn btn-sm btn-error btn-outline'
                onClick={handleDeleteClick}
              >
                <Trash2Icon className='size-4' />
              </button>
            </div>
          )}
        </div>
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