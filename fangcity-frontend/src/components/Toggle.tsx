import React, { useState } from "react";

export const Toggle = ({ label, label2, toggled, onClick }) => {
  const [isToggled, toggle] = useState(toggled);

  const callback = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  };

  return (
    <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
            <span className="text-white">{label2}</span>
            <input className="sr-only peer h-0 w-0 opacity-0" readOnly type="checkbox" defaultChecked={isToggled} onClick={callback} />
            <div className="m-2 relative w-8 h-[10px] bg-white border-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-[] after:content-[''] after:absolute after:-top-1 after:left-0 after:bg-[#FFC657] after:border-none after:rounded-full after:h-[18px] after:w-[18px] after:transition-all " ></div>
            <span className="text-white"> {label}</span>
        </label>  
    </div>
    
  );
};
