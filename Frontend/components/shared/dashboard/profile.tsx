import { ChevronDown, LogOut, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  return (
    <div className="pt-4 px-4 md:px-0 max-w-6xl w-full ">
      <section className="mb-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Your Profile Pic</h3>
        <p className="text-[12px] text-black mb-6">This will be displayed on your profile</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden relative bg-gray-100">
            <Image src="/Ellipse.png" alt="Avatar" fill className="object-cover" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="text-xs px-4 py-2">
              Upload new picture
            </Button>

            <Button variant="outline" className="text-xs px-4 py-2 text-gray-500">
              Delete
            </Button>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-300 w-full mb-10" />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div>
          <h3 className="text-[15px] font-bold text-gray-800">Personal info.</h3>
          <p className="text-[12px] text-gray-400 mt-1">Add your personal information</p>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['First Name', 'Last Name', 'Email Address'].map((label, i) => (
            <div key={i} className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-gray-700">{label}</label>
              <input className="w-full border border-gray-200 p-3 rounded-lg text-[13px]" />
            </div>
          ))}

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[13px] font-bold text-gray-700">Mobile Number</label>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-3 flex items-center gap-1 text-[13px] text-gray-600 border-r">
                +234 <ChevronDown size={14} />
              </div>
              <input className="flex-1 p-3 text-[13px]" />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-300 w-full mb-10" />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div>
          <h3 className="text-[15px] font-bold text-gray-800">Bio & Other info.</h3>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input className="border p-3 rounded-lg" placeholder="Address Line 1" />
          <input className="border p-3 rounded-lg" placeholder="Address Line 2" />
          <textarea rows={5} className="sm:col-span-2 border p-4 rounded-lg" />
        </div>
      </section>

      <div className="border-t border-gray-300 w-full mb-10" />

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
        <div>
          <h3 className="text-[15px] font-bold text-gray-800">Account Security</h3>
        </div>

        <div className="md:col-span-3 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <LogOut size={16} /> Logout
          </Button>

          <Button variant="outline" className="flex items-center gap-2 text-red-500">
            <Trash2 size={16} /> Delete my account
          </Button>
        </div>
      </section>
    </div>
  )
}
