import * as React from "react";
import { Link } from "react-router-dom";

export default function AddRoles() {
  return (
    <div className="m-[200px]">
      <h1 className="font-bold">Nouveau role</h1>

      <div className="my-6">
        <form action="">
          <div className="">
            <div className="my-3 w-[50%]">
              <label className="font-normal" htmlFor="role">
                Intitulé du role
              </label>
              <br />
              <input
                className="mt-2 h-9 w-full rounded-md border border-blue-200 p-3 outline-none transition-all duration-500 focus:border-primary"
                type="text"
              />
            </div>

            <div className="my-9">
              <h3 className="font-normal">Permissions</h3>

              <div className="mt-2 grid grid-cols-7">
                <div className="flex">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#ddd] checked:border-transparent checked:bg-primary outline-none transition-all duration-700"
                    />
                    <span className="text-gray-700">Read</span>
                  </label>
                </div>

                <div className="flex">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#ddd] checked:border-transparent checked:bg-primary outline-none transition-all duration-700"
                    />
                    <span className="text-gray-700">Create</span>
                  </label>
                </div>

                <div className="flex">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#ddd] checked:border-transparent checked:bg-primary outline-none transition-all duration-700"
                    />
                    <span className="text-gray-700">Update</span>
                  </label>
                </div>

                <div className="flex">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#ddd] checked:border-transparent checked:bg-primary outline-none transition-all duration-700"
                    />
                    <span className="text-gray-700">Delete</span>
                  </label>
                </div>
              </div>

              <div></div>
            </div>

            <div className="mt-8">
                <input className="border border-primary cursor-pointer text-primary hover:bg-primary hover:text-white transition-all duration-500 px-3 py-2 rounded-md font-semibold" type="submit" value="Valider" />
            </div>


          </div>
        </form>
      </div>
    </div>
  );
}
