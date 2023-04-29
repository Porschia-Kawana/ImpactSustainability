import { useEffect, useState, useMemo } from "react";
import Table from "./Table";

import "./App.scss";

function App() {
    const [data, setData] = useState();
    const [selectAll, setSelectAll] = useState();

    function filterGreaterThan(rows, id, filterValue) {
        if (filterValue.range) {
            const filtered = rows.filter(row => {
                let startDate = new Date(row.original.startDate).getTime();
                let lastYear = new Date(filterValue.range).getTime();
                return startDate >= lastYear
            })
            return filtered
        } else {
            return rows.filter(row => {
                return new Date(row.original.startDate).getFullYear() === filterValue
            })
        }
    }

    const handleSelected = (current, selected) => {
        const updateData = data.map((row) => {
            if (row === current) {
                row.selected = selected
            }
            return row
        })
        setData(updateData)
    }

    useEffect(() => {
        // TODO::: Bug with Header value updating
        if (data) {
            const updateData = data.map((row) => {
                row.selected = selectAll
                return row
            })
            setData(updateData)
        }
    }, [selectAll])

    const columns = useMemo(
        () => [
            {
                Header: () => {
                    return (
                        <div className="Input">
                            <input
                                type="checkbox"
                                className="checkbox"
                                value={selectAll}
                                onChange={(e) => setSelectAll(e.target.checked)}
                            />
                        </div>
                    )
                },
                id: "checkbox",
                accessor: "selected",
                Cell: ({ cell: { value }, row: { original } }) => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={value}
                            onChange={(e) => handleSelected(original, e.target.checked)}
                        />
                    );
                },
            },
            {
                Header: "Location",
                accessor: "location",
            }, {
                Header: "Meter ID",
                accessor: "meterId",
            }, {
                Header: "Start date",
                accessor: "startDate",
                filter: filterGreaterThan,
            }, {
                Header: "End date",
                accessor: "endDate",
            }, {
                Header: "Provider",
                accessor: "provider",
            }, {
                Header: "Usage",
                accessor: "usageKwh",
            }, {
                Header: "GreenPower %",
                accessor: "greenPower",
            }, {
                Header: "Amount Paid",
                accessor: "amountPaid",
            }, {
                Header: "Emissions",
                accessor: "emissions",
            }
        ]

    )

    useEffect(() => {
        fetch('https://impact-code-test.fly.dev/fetch-data')
            .then(response => {
                return response.text()
            })
            .then(data => {
                const responses = JSON.parse(data)
                var options = { year: 'numeric', month: 'short', day: 'numeric' };

                const selectResponse = responses.map((response) => {
                    response.selected = false
                    response.startDate = new Date(response.startDate).toLocaleDateString("en-US", options)
                    response.endDate = new Date(response.endDate).toLocaleDateString("en-US", options)
                    response.usageKwh = response.usageKwh + ' kWh'
                    response.emissions = response.emissions + ' tC02e'
                    response.greenPower = response.greenPower + '%'
                    response.amountPaid = '$' + Number(response.amountPaid).toFixed(2)
                    return response
                })

                setData(selectResponse)
            })
            .catch(error => {
                // handle the error
            });
    }, [])

    return (
        <div className="App">
            <header className="Header"></header>
            <section className="Section">
                {data &&
                    <Table columns={columns} data={data} />
                }
            </section>
            <footer className="Footer"></footer>
        </div>
    );
}

export default App;
