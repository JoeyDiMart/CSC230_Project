const Sidebar = () => {
    return (
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
                <img src="https://img.logoipsum.com/243.svg" className="w-32" alt=""></img>
                <button className="p-1.5 rounded-lg bg-black-50 hover:bg-grey-100">BUTTON</button>
            </div>
        </nav>
        
      </aside>
    );
  };
  
  export default Sidebar;
  