import { json } from '@sveltejs/kit';

const headers = new Headers();
headers.append('Authorization', 'Basic YWRtaW46YWRtaW4=');

const table = `<table class=formlisting border=0>`;
const endTable = `</table>`;
const row = `<tr bgcolor=#b7b7b7>`;
const col = `<td><font size=2>`;
const endCol = `</td>`;

export async function GET() {
   const response = await fetch('http://192.168.1.1/wlclients.htm',
      {
         method: 'GET',
         headers,
      });
   let text = await response.text();
   text = text.slice(text.indexOf(table));
   text = text.slice(undefined, text.indexOf(endTable));

   const data: Record<string, number> = {};

   for (; ;) {
      const rowIndex = text.indexOf(row);
      if (rowIndex < 0) break;
      text = text.slice(rowIndex + row.length);

      text = text.slice(text.indexOf(col) + col.length);
      const mac = text.slice(undefined, text.indexOf(endCol));

      text = text.slice(text.indexOf(col) + col.length);
      const packets = +text.slice(undefined, text.indexOf(endCol));

      data[mac] = packets;
   }
   return json(data);
}



