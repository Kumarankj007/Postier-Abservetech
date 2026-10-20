import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Table from "@/components/ui/Table";
import { Textinput } from "@components/ui/input";
import useReactQuery from "@/hooks/useReactQuery";
import { getFilterSchema, normalizeFilter } from "@/utils/filterHelper";
import usePostMutation from "@/hooks/usePostMuation";
import { APICONSTANT } from "@/components/services/config";

const ApiTable = ({
  title = "Post",
  listAPI,
  columns,
  addPage,
  additionalSchema = {},
  dataApiName,
  children,
}) => {
  // States
  // console.log("columnstable", columns, addPage)
  const filterSchema = getFilterSchema(additionalSchema);
  const [filter, setFilter] = useState(filterSchema.state);

  console.log("dataApiName", dataApiName)
  // All hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();
  console.log("location", location.pathname)

  // const searchQueryString = useMemo(() => {
  //   queryClient.cancelQueries({ queryKey: [listAPI] });
  //   const query = normalizeFilter(filterSchema.schema, filter);
  //   return query;
  // }, [filter]);

  const searchQueryString = useMemo(() => {
    queryClient.cancelQueries({ queryKey: [listAPI] });
    let baseAPI = listAPI;
    if (location.pathname === "/rating") {
      baseAPI = `${filter.modelType === "Post" ? "moduleType=Post" : "moduleType=Trip"}`;
    }
    const query = normalizeFilter(filterSchema.schema, filter);
    if (location.pathname === "/rating") {
      return `${baseAPI}`;
    }
    else if (location.pathname === "/pages") {
      return baseAPI
    }
    else {
      return query
    }

  }, [filter]);





  const { data: datas, status } = useReactQuery(listAPI, searchQueryString);
  console.log("datas", datas)
  // Functions
  const onPageChange = (obj) => {
    setFilter((prev) => ({ ...prev, ...obj }));
  };

  const handleOnSearch = (e) => {
    setFilter((prev) => ({ ...prev, page: 1, search: e.target.value }));
  };

  const handleOnModuleChange = (e) => {
    // debugger
    setFilter((prev) => ({
      ...prev,
      modelType: e.target.value,
    }));
    console.log("handleOnModuleChange", filter.modelType)
  };

  const handleOnAdd = () => {
    navigate(addPage);
  };


  const postMutation = usePostMutation("");

  const handleOnJson = () => {
    postMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.generatejson },
      body: {
      }
    })
  }


  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">View {title}</h4>
        <div className="flex flex-row justify-center items-center gap-2">
          <div>

            {typeof children === "function"
              ? children({ filter, setFilter })
              : null}
          </div>
          {
            location.pathname === "/rating" && <select value={filter.modelType} onChange={handleOnModuleChange} style={{
              border: '1px solid #e2e8f0',
              padding: '6px 15px',
              borderRadius: '5px'
            }}>
              <option value="Post">Post</option>
              <option value="Trip">Trip</option>
            </select>
          }


          <div>
            <Textinput
              type="search"
              placeholder="Search"
              value={filter.search}
              onChange={handleOnSearch}
            />
          </div>

          {addPage && location.pathname != "/rating" && location.pathname != "/trip/view-trip" && (

            <div>
              <Button
                text={"Add " + title}
                className="py-2 px-2 bg-gray-900 text-[white]"
                onClick={handleOnAdd}
              />
            </div>
          )}


          {
            location.pathname === "/Languages" && <Button
              text={"Generate JSON"}
              className="py-2 px-2 bg-gray-900 text-[white]"
              onClick={handleOnJson}
            />
          }

        </div>
      </div>
      <Table
        data={datas?.data[dataApiName] || []}
        columns={columns}
        loading={status === "pending"}
        onPageChange={onPageChange}
        total={datas?.data?.total || 0}
        page={filter.page}
        perPage={filter.limit}
      />
    </Card>
  );
};

export default ApiTable;
