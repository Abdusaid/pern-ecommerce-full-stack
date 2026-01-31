import { PlusCircleIcon, RefreshCwIcon, PackageIcon } from "lucide-react";
import { useStudentStore } from "../store/useStudentStore"
import { useEffect } from "react";
import StudentCard from "../components/StudentCard";
import AddStudentModal from "../components/AddStudentModal";
import { useUser } from "@clerk/clerk-react";

function HomePage() {
  const {students, error, loading, resetForm, fetchStudents, isNavigating, setNavigating} = useStudentStore();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const loadStudents = async () => {
      await fetchStudents();
      // Clear navigating flag after students are fetched
      setNavigating(false);
    };
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        {isSignedIn ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              document.getElementById('add_student_modal').showModal();
            }}
          >
            <PlusCircleIcon className="size-5 mr-2" />
            New Student
          </button>
        ) : (
          <div className="text-base-content/60">
            
          </div>
        )}
        <button className="btn btn-ghost btn-circle" onClick={fetchStudents}>
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      {isSignedIn && <AddStudentModal />}

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {students.length === 0 && !loading && !isNavigating && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No students found</h3>
            <p className="text-gray-500 max-w-sm">
              Get started by adding your first student to the inventory
            </p>
          </div>
        </div>
      )}

      {loading || isNavigating ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </main>
  )
}

export default HomePage