import { getConnection, sql } from '../database';
const XLSX = require('xlsx');
import fs from 'fs';
// import file from './commands.xlsx';

export const getDepartments = async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool.request().query('Select * FROM DMKhoaPhong');
		res.json({ success: true, data: result.recordset });
	} catch (error) {
		res.status(500);
		res.send(error.message);
	}
};

export const getRooms = async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool.request().query('Select * FROM DMBuongPhong');
		res.json({ success: true, data: result.recordset });
	} catch (error) {
		res.status(500);
		res.send(error.message);
	}
};

export const getCommands = (req, res) => {
	// Read file excel
	const wb = XLSX.readFile('./commands.xlsx');
	// // Read sheet from workbook
	var ws = wb.Sheets['Danhmuc'];

	// Read sheet data and convert it into json
	const data = XLSX.utils.sheet_to_json(ws, { raw: false });
	res.json({ success: true, commands: data });
	// const ws = wb.Sheets['Danhmuc'];
	// fs.readFile('./demo.xlsx', 'utf8', (error, data) => {
	// 	if (error) {
	// 		return console.log(error);
	// 	}
	// 	console.log('data:', data);
	// });
	// console.log(ws);
};
