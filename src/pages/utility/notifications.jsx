import React, { useState, useEffect, useContext, Fragment } from "react";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { notifications } from "@/constant/data";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "@/SocketPage";
import { useSelector, useDispatch } from "react-redux";
import { getNotificationList, updateNotificationList } from "@/store/commonStore"

const NotificationPage = () => {

  const [notiArray, setNotiArray] = useState([])
  const dispatch = useDispatch();
  const val = useContext(SocketContext)
  const { notificationn } = useSelector((state) => state.commonStore);
  const fetchNotificationData = async () => {
    await dispatch(getNotificationList())
  }


  useEffect(() => {
    const handleNotification = (messageData) => {
      fetchNotificationData()
    };
    val.socket.on("notificationforadmin", handleNotification);
    return () => {
      val.socket.off("notificationforadmin", handleNotification)
    }
  }, [val])

  useEffect(() => {
    fetchNotificationData()
  }, [])

  return (
    <div>
      <Card bodyClass="p-0">
        <div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
          <div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
            All Notifications
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <Menu as={Fragment}>
            {notificationn?.map((item, i) => (
              <Menu.Item key={i}
              //  onClick={()=>
              //   {
              //     if(i === 2){
              //       navigate("/dashboard")
              //     }
              // }}
              >
                {({ active }) => (
                  // <Link to="/admin/neworderpage/">
                  <Link to={{ pathname: "/admin/neworderpage/", state: "dataToPass" }}>
                  <div
                  onClick={async () => { await dispatch(updateNotificationList(item?._id)), await dispatch(getNotificationList()) }}
                    className={`${active
                      ? "bg-slate-100 dark:bg-slate-700 dark:bg-opacity-70 text-slate-800"
                      : "text-slate-600 dark:text-slate-300"
                      } block w-full px-4 py-2 text-sm  cursor-pointer`}
                  >
                    <div className="flex ltr:text-left rtl:text-right">
                      <div className="flex-none ltr:mr-3 rtl:ml-3">
                        {/* <div className="h-8 w-8 bg-white rounded-full">
                          <img
                            src={item.image}
                            alt=""
                            className={`${
                              active ? " border-white" : " border-transparent"
                            } block w-full h-full object-cover rounded-full border`}
                          />
                        </div> */}
                      </div>
                      <div className="flex-1 h-[40px] " >

                        <div 
                          className={`${active
                            ? "text-slate-600 dark:text-slate-300"
                            : " text-slate-600 dark:text-slate-300"
                            } text-sm`}
                        >
                            {item.message}
                        </div>
                        <div
                          className={`${active
                            ? "text-slate-500 dark:text-slate-200"
                            : " text-slate-600 dark:text-slate-300"
                          } text-xs leading-4`}
                          >
                          {item.desc}
                        </div>
                        <div className="text-slate-400 dark:text-slate-400 text-xs mt-1">
                          {/* 3 min ago */}
                        </div>
                      </div>
                      {item.unread && (
                        <div className="flex-0">
                          <span className="h-[10px] w-[10px] bg-danger-500 border border-white dark:border-slate-400 rounded-full inline-block"></span>
                        </div>
                      )}
                    </div>
                  </div>
                      </Link>
                )}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Card>
    </div>
  );
};

export default NotificationPage;