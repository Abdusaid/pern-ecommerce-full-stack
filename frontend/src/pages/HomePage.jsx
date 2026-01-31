import { PlusCircleIcon, GraduationCap } from "lucide-react";
import { useStudentStore } from "../store/useStudentStore"
import { useEffect, useState, useRef } from "react";
import StudentCard from "../components/StudentCard";
import AddStudentModal from "../components/AddStudentModal";
import { useUser } from "@clerk/clerk-react";

function HomePage() {
  const {students, error, loading, resetForm, fetchStudents, isNavigating, setNavigating} = useStudentStore();
  const { isSignedIn } = useUser();
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const loadStudents = async () => {
      await fetchStudents();
      // Clear navigating flag after students are fetched
      setNavigating(false);
    };
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pull-to-refresh handlers
  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && !loading) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;

      if (distance > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, 150));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80) {
      await fetchStudents();
    }
    setIsPulling(false);
    setPullDistance(0);
    touchStartY.current = 0;
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pullDistance, loading]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 flex justify-center items-center transition-all duration-200 z-50"
          style={{
            transform: `translateY(${Math.min(pullDistance - 80, 70)}px)`,
            opacity: Math.min(pullDistance / 100, 1)
          }}
        >
          <div className="bg-base-100 rounded-full p-3 shadow-lg border border-primary/20">
            <GraduationCap
              className={`size-6 text-primary ${pullDistance > 80 ? 'animate-spin' : ''}`}
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-primary/50"></div>
          <GraduationCap className="size-10 text-primary" />
          <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-primary/50"></div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Distinguished Alumni
        </h1>
        <p className="text-base-content/60 max-w-2xl mx-auto">
          Celebrating excellence and achievements of our outstanding graduates
        </p>
      </div>

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
      </div>

      {isSignedIn && <AddStudentModal />}

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {students?.length === 0 && !loading && !isNavigating && (
        <div className="flex flex-col justify-center items-center h-96 space-y-6">
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-8 border-4 border-dashed border-primary/30">
              <GraduationCap className="size-20 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 badge badge-primary badge-lg">New!</div>
          </div>
          <div className="text-center space-y-3 max-w-md">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              No Alumni Yet
            </h3>
            <p className="text-base-content/60 leading-relaxed">
              Begin building your distinguished alumni network by adding accomplished graduates who have made their mark
            </p>
            {isSignedIn && (
              <button
                className="btn btn-primary btn-lg gap-2 mt-4"
                onClick={() => {
                  resetForm();
                  document.getElementById('add_student_modal').showModal();
                }}
              >
                <PlusCircleIcon className="size-5" />
                Add First Alumni
              </button>
            )}
          </div>
        </div>
      )}

      {loading || isNavigating ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {students?.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </main>
  )
}

export default HomePage