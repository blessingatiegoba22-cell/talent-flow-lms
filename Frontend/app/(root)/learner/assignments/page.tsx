import AssignmentRow from "@/components/shared/AssigmentRow";
import ProgressOverview from "@/components/shared/ProgressRing";
import { Book, Monitor, Users, Calendar, CalendarCheck, FileCheck, Trophy } from "lucide-react";

export default function AssignmentsPage() {
  return (
    <div className="max-w-8xl mx-auto p-6 lg:p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Assignments</h1>
        <p className="text-slate-500 font-medium mt-1">
          Hi, Samuel. Manage your assignments and projects here 😄
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Recent</h2>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
              <AssignmentRow icon={Book} label="Course" value="UI/UX Design Fundamentals" />
              <AssignmentRow icon={Monitor} label="Timeline" value="Week 4 Assessment" />
              <AssignmentRow icon={Users} label="Topic" value="Laws of UX" />
              <AssignmentRow icon={Calendar} label="Posted" value="10:12am, Monday 24th March, 2026" />
              <AssignmentRow icon={CalendarCheck} label="Due" value="10:12am, Monday 31st March, 2026" isLast />
              
              <div className="p-6 flex gap-4 bg-white border-t border-indigo-100">
                <button className="flex-1 py-3 bg-brand-blue-900 text-white font-bold rounded-xl hover:bg-brand-blue-800 transition-colors">
                  View
                </button>
                <button className="flex-1 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Completed</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden opacity-90">
              <AssignmentRow icon={Book} label="Course" value="Time Management" />
              <AssignmentRow icon={Monitor} label="Timeline" value="Week 1 Assessment" />
              <AssignmentRow icon={Users} label="Topic" value="19 Practical steps in time management" />
              <AssignmentRow icon={Calendar} label="Posted" value="01:16pm, Tuesday 4th December, 2025" />
              <AssignmentRow icon={CalendarCheck} label="Due" value="11:59pm, Monday 31st December, 2025" />
              <AssignmentRow icon={FileCheck} label="Status" value="Graded" />
              <AssignmentRow icon={Trophy} label="Grade" value="86%" isLast />
              
              <div className="p-6 bg-white border-t border-slate-200">
                <button className="w-full md:w-48 py-3 bg-brand-blue-900 text-white font-bold rounded-xl">
                  View
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-10">
            <ProgressOverview />
          </div>
        </div>
      </div>
    </div>
  );
}