import { Combobox } from "@headlessui/react";
import { useState } from "react";
import { User } from "../Models";

export function UserCombo({ users, value, handleChange }: { users: User[]; value:User; handleChange: any}) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? users
      : users.filter((person) => {
          return (
            person.name.toLowerCase().includes(query.toLowerCase()) ||
            person.short.toLowerCase().includes(query.toLowerCase())
          );
        });

  const formatVal = (user:User) => {
      return user.name ? `${value.name} (${value.short})` : ""
  }
  return (
    <Combobox value={formatVal(value)} onChange={(e) => {handleChange(e)}}>
      <Combobox.Input onChange={(event) => setQuery(event.target.value)} className="bg-white p-1 outline outline-1 outline-stone-400 rounded-md"/>
      <Combobox.Options className="bg-white my-2 outline outline-1 outline-stone-400 rounded-md">
        {filteredPeople.slice(0, 5).map((person) => (
          <Combobox.Option key={person.name} value={person} className="p-1 y-2 border-b hover:bg-indigo-200">
            <div className="grid grid-cols-2">
            <div>{person.name} 
            </div>
            <div className="ml-auto">{`(${person.short})`}
            </div>
            </div>
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
}
export default UserCombo;
