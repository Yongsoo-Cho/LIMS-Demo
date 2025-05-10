import { TableData } from "./processMetadata";

const stringify_table: (data: TableData) => string = (data) => {

    if (!data) return "";

    const h_raw = data.headers.join(',');

    const reduced: string[] = data.rows.map((v) => {
        const arr: string[] = v.map((c) => c.value)
        return arr.join(',')
    })

    const raw = reduced.join('\n');

    console.log(h_raw, raw)
    return [h_raw, raw].join('\n');
}

export const download_file = (data: TableData, name: string, bom: boolean = false) => {

    let str = stringify_table(data);

    if (str === "") {
        console.log('Nothing to download.')
        return;
    }

    if (!name.toLowerCase().endsWith('.csv')) {
        name += '.csv'
    }

    str = bom ? `uFEFF${str}` : str

    const blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    // Dummy element to trigger click
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click()

    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}