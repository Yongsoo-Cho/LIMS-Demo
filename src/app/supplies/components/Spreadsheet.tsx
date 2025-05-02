import React from "react";
import { TableData, Cell } from "../processMetadata";

type PropInterface = {
    data: TableData
}

export class Spreadsheet extends React.Component<PropInterface> {

    // will get the header cells
    getHeaders() {
        if (this.props.data === null || this.props.data.headers === null) return;

        let cells = this.props.data.headers.map((val, col_idx) => {
            return (
                <th
                    key={col_idx}
                    className="min-w-[100px] h-10 bg-gray-100 border border-gray-300 text-sm font-medium !text-black"
                >
                    {val}
                </th>
            );
        })
        cells.unshift(<th key={-1} className="w-10 h-10 bg-gray-100 border border-gray-300 text-sm font-medium !text-black">{/*Empty Cell*/}</th>);

        return cells;
    }

    getBody() {
        if (this.props.data === null) return;

        const getCells = (row: Cell[], _: number) => {
            return row.map((cell, col_idx) => {
                return <td key={col_idx} className="h-10 border border-gray-300 px-2 py-1 !text-black">
                    {cell.value}
                </td>
            })
        }

        let body = this.props.data.rows.map((row, row_idx) => {
            return (
                <tr key={row_idx}>
                    <td className="w-10 h-10 bg-gray-100 border border-gray-300 text-center text-sm font-medium !text-black">
                        {row_idx + 1}
                    </td>
                    {getCells(row, row_idx)}
                </tr>
            )
        })

        return body;
    }

    render() {

        if (this.props.data === null) return <></>;

        return (
            <div className="h-full w-full max-w-4xl mx-auto p-4 overflow-auto">

                <div className="border border-gray-300 rounded-md overflow-hidden">
                    <table className="w-full border-collapse">
                    <thead>
                        <tr>{this.getHeaders()}</tr>
                    </thead>
                    <tbody>
                        {this.getBody()}
                    </tbody>
                    </table>
                </div>
        </div>
        )
    }
}