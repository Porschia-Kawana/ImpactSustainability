import React, { useEffect, useState } from "react";
import { useTable, useFilters, useGlobalFilter, usePagination } from "react-table";

import './Table.scss';

export default function Table({ columns, data }) {
    const [globalFilterInput, setGlobalFilterInput] = useState("");
    const [yearFilterInput, setYearFilterInput] = useState("");
    const [locationFilterInput, setLocationFilterInput] = useState("");
    const [providersFilterInput, setProvidersFilterInput] = useState("");

    const [years, setYears] = useState();
    const [locations, setLocations] = useState();
    const [providers, setProviders] = useState();


    useEffect(() => {
        if (!years && !locations && !providers) {
            const allLocations = data.map(row => row.location)
            const allProviders = data.map(row => row.provider)

            setYears(["Last 12 months", "2023", "2022", "2021", "2020", "2019"])

            setLocations(allLocations.filter(
                (obj, index) =>
                    allLocations.findIndex((item) => item === obj) === index
            ))

            setProviders(allProviders.filter(
                (obj, index) =>
                    allProviders.findIndex((item) => item === obj) === index
            ))
        }
    }, [years, locations, providers])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        setFilter,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageSize: 7 },
    },
        useFilters,
        useGlobalFilter,
        usePagination
    );

    const handleSearchAll = e => {
        const value = e.target.value || undefined;
        setGlobalFilter(value);
        setGlobalFilterInput(value);
    };

    const handleYearFilter = e => {
        setYearFilterInput(e.target.value);
        if (e.target.value === "All years") setFilter("startDate", undefined);
        else if (e.target.value === "Last 12 months") {
            // TODO::: Need to look into how to do date range filtering on react table 
            setFilter("startDate", new Date().getFullYear() - 1)
        }
        else setFilter("startDate", new Date(e.target.value).getFullYear());
    }

    const handleLocationFilter = e => {
        console.log(e.target.value)
        const value = e.target.value !== "All locations" ? e.target.value : undefined;
        setFilter("location", value);
        setLocationFilterInput(value);
    }

    const handleProvidersFilter = e => {
        const value = e.target.value !== "All providers" ? e.target.value : undefined;
        setFilter("provider", value);
        setProvidersFilterInput(value);
    }

    return (
        <div className="UsageTable">
            <div className="Container">
                <div className="Header">
                    <div className="Input">
                        <input
                            value={globalFilterInput}
                            onChange={handleSearchAll}
                            placeholder={"Search"}
                        />
                    </div>
                    {years &&
                        <div className="Input">
                            <select onChange={handleYearFilter} value={yearFilterInput} >
                                <option>All years</option>
                                {years.map((year) => (
                                    <option>{year}</option>
                                ))}
                            </select>
                        </div>
                    }
                    {locations &&
                        <div className="Input">
                            <select onChange={handleLocationFilter} value={locationFilterInput}>
                                <option>All locations</option>
                                {locations.map((location) => (
                                    <option>{location}</option>
                                ))}
                            </select>
                        </div>
                    }
                    {providers &&
                        <div className="Input">
                            <select onChange={handleProvidersFilter} value={providersFilterInput}>
                                <option>All providers</option>
                                {providers.map((provider) => (
                                    <option>{provider}</option>
                                ))}
                            </select>
                        </div>
                    }
                </div>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>

                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()} >{cell.render("Cell")}</td>;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="Pagination">
                <div className="text">
                    {pageIndex * pageSize + pageSize < data.length ? pageIndex * pageSize + pageSize : data.length} of {data.length}
                </div>
                <button className="button left" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button className="button right" onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
            </div>
        </div>
    );
}
