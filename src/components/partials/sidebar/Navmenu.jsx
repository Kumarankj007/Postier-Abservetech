// import React, { useEffect, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { Collapse } from "react-collapse";
// import Icon from "@/components/ui/Icon";
// import { useDispatch } from "react-redux";
// import { menuItems } from "@/constant/data";

// const Navmenu = ({ menus }) => {
//   console.log("Navmenu", menus)
//   const [activeSubmenu, setActiveSubmenu] = useState(null);

//   const toggleSubmenu = (i) => {
//     if (activeSubmenu === i) {
//       setActiveSubmenu(null);
//     } else {
//       setActiveSubmenu(i);
//     }
//   };

//   const location = useLocation();
//   const locationName = location.pathname.replace("/", "");
//   const dispatch = useDispatch();

//   const mergedMenus = menus?.map((menu) => {
//     // debugger
//     const matchedItem = menuItems.find((item) => item.title === menu.menu);

//     return {
//       ...menu, // Keep original data from menus
//       link: matchedItem?.link || null, // Add link
//       icon: matchedItem?.icon || null, // Add icon
//     };
//   });

//   console.log(mergedMenus, "mergedMenus");

//   useEffect(() => {
//     let submenuIndex = null;

//     menus.map((item, i) => {
//       if (!item?.child) return;
//       if (item?.link === locationName) {
//         submenuIndex = null;
//       } else {
//         const ciIndex = item?.child?.findIndex(
//           (ci) => ci.childlink === locationName
//         );
//         if (ciIndex !== -1) {
//           submenuIndex = i;
//         }
//       }
//     });
//     document.title = `Postier`;

//     setActiveSubmenu(submenuIndex);
//   }, [location]);

//   useEffect(() => {
//     console.log("Menus:", menus); // Debugging

//     let submenuIndex = null;
//     if (menus && Array.isArray(menus)) {
//       menus.map((item, i) => {
//         if (!item?.child) return;
//         if (item?.link === locationName) {
//           submenuIndex = null;
//         } else {
//           const ciIndex = item?.child?.findIndex(
//             (ci) => ci.childlink === locationName
//           );
//           if (ciIndex !== -1) {
//             submenuIndex = i;
//           }
//         }
//       });
//     } else {
//       console.warn("Menus is not an array or is undefined.");
//     }

//     document.title = `Postier`;
//     setActiveSubmenu(submenuIndex);
//   }, [location]);

//   return (
//     <>
//       <ul>
//         {Array.isArray(menus) && menus.map((item, i) => (

//           <li
//             key={i}
//             className={` single-sidebar-menu
//               ${item.subMenuList ? "item-has-children" : ""}
//               ${activeSubmenu === i ? "open" : ""}
//               ${locationName === item.link ? "menu-item-active" : ""}`}
//           >
//             {!item.subMenuList && (
//               <NavLink className="menu-link" to={item.link}>
//                 <span className="menu-icon flex-grow-0">
//                   <Icon icon={item.icon} />
//                 </span>
//                 <div className="text-box flex-grow">{item.title}</div>
//                 {item.badge && <span className="menu-badge">{item.badge}</span>}
//               </NavLink>
//             )}
//             {!item.subMenuList && (
//               <div className="menulabel">{item.title}</div>
//             )}
//             {item.subMenuList && (
//               <div
//                 className={`menu-link ${activeSubmenu === i
//                   ? "parent_active not-collapsed"
//                   : "collapsed"
//                   }`}
//                 onClick={() => toggleSubmenu(i)}
//               >
//                 <div className="flex-1 flex items-start">
//                   <span className="menu-icon">
//                     <Icon icon={item.icon} />
//                   </span>
//                   <div className="text-box">{item.title}</div>
//                 </div>
//                 <div className="flex-0">
//                   <div
//                     className={`menu-arrow transform transition-all duration-300 ${activeSubmenu === i ? " rotate-90" : ""
//                       }`}
//                   >
//                     <Icon icon="heroicons-outline:chevron-right" />
//                   </div>
//                 </div>
//               </div>
//             )}
//             <Collapse isOpened={activeSubmenu === i}>
//               <ul className="sub-menu ">
//                 {item.subMenuList?.map((subItem, j) => (
//                   <li key={j} className="block pl-4 pr-1 mb-4 first:mt-4">
//                     <NavLink to={subItem.childlink}>
//                       {({ isActive }) => (
//                         <span
//                           className={`${isActive
//                             ? " text-black dark:text-white font-medium"
//                             : "text-slate-600 dark:text-slate-300"
//                             } text-sm flex space-x-3 items-center transition-all duration-150`}
//                         >
//                           <span
//                             className={`${isActive
//                               ? " bg-slate-900 dark:bg-slate-300 ring-4 ring-opacity-[15%] ring-black-500 dark:ring-slate-300 dark:ring-opacity-20"
//                               : ""
//                               } h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none`}
//                           ></span>
//                           <span className="flex-1">{subItem.childtitle}</span>
//                         </span>
//                       )}
//                     </NavLink>
//                   </li>
//                 ))}
//               </ul>
//             </Collapse>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// export default Navmenu;

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse } from "react-collapse";
import Icon from "@/components/ui/Icon";
import { useDispatch } from "react-redux";

const Navmenu = ({ menus }) => {
  // console.log("activeSubmenu", menus)
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const location = useLocation();
  const locationName = location.pathname.replace("/", "");
  const dispatch = useDispatch();
  useEffect(() => {
    let submenuIndex = null;
    menus?.length > 0 &&
      menus?.map((item, i) => {
        if (!item.subMenuList) return;
        if (item.link === locationName) {
          submenuIndex = null;
        } else {
          const ciIndex = item.subMenuList.findIndex(
            (ci) => ci.childlink === locationName,
          );
          if (ciIndex !== -1) {
            submenuIndex = i;
          }
        }
      });
    document.title = `Postier`;

    setActiveSubmenu(submenuIndex);
  }, [location]);

  return (
    <>
      <ul>
        {menus?.length > 0 &&
          menus?.map((item, i) => (
            <li
              key={i}
              className={` single-sidebar-menu 
              ${item.subMenuList ? "item-has-children" : ""}
              ${activeSubmenu === i ? "open" : ""}
              ${locationName === item.link ? "menu-item-active" : ""}`}
            >
              {!item.subMenu && (
                // && !item.isHeadr
                <NavLink className="menu-link" to={item.link}>
                  <span className="menu-icon flex-grow-0">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box flex-grow">{item.menu}</div>
                  {/* {item.badge && <span className="menu-badge">{item.badge}</span>} */}
                </NavLink>
              )}
              {
                // item.isHeadr &&
                !item.subMenuList && (
                  <div className="menulabel">{item.menu}</div>
                )
              }
              {item.subMenu && (
                <div
                  className={`menu-link ${
                    activeSubmenu === i
                      ? "parent_active not-collapsed"
                      : "collapsed"
                  }`}
                  onClick={() => toggleSubmenu(i)}
                >
                  <div className="flex-1 flex items-start">
                    <span className="menu-icon">
                      <Icon icon={item.icon} />
                    </span>
                    <div className="text-box">
                      {item.menu}
                      {item.link}
                    </div>
                  </div>
                  <div className="flex-0">
                    <div
                      className={`menu-arrow transform transition-all duration-300 ${
                        activeSubmenu === i ? " rotate-90" : ""
                      }`}
                    >
                      <Icon icon="heroicons-outline:chevron-right" />
                    </div>
                  </div>
                </div>
              )}
              <Collapse isOpened={activeSubmenu === i}>
                <ul className="sub-menu ">
                  {item.subMenuList?.map((subItem, j) => (
                    <li key={j} className="block pl-4 pr-1 mb-4 first:mt-4">
                      <NavLink to={subItem.childlink}>
                        {({ isActive }) => (
                          <span
                            className={`${
                              isActive
                                ? " text-black dark:text-white font-medium"
                                : "text-slate-600 dark:text-slate-300"
                            } text-sm flex space-x-3 items-center transition-all duration-150`}
                          >
                            <span
                              className={`${
                                isActive
                                  ? " bg-slate-900 dark:bg-slate-300 ring-4 ring-opacity-[15%] ring-black-500 dark:ring-slate-300 dark:ring-opacity-20"
                                  : ""
                              } h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none`}
                            ></span>
                            <span className="flex-1">{subItem.menu}</span>
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Navmenu;
