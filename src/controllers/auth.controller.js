import { getConnection, sql } from '../database';
import jwt from 'jsonwebtoken';
export const getAuth = async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input('MaNV', sql.VarChar, req.MaNV)
			.query('Select * FROM DMNhanVien WHERE MaNV=@MaNV');
		if ((result.rowsAffected = 0)) {
			return res.status(400).json({ success: false, message: 'User not found' });
		}
		res.json({ success: true, user: result.recordset });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input('user', sql.VarChar, username)
			.input('password', sql.VarChar, password)
			.query('Select * FROM DMNhanVien WHERE MaNV = @user OR MatKhau = @password');
		console.log(typeof result.recordset[0].MaNV);
		const payload = {
			MaNV: result.recordset[0].MaNV,
		};
		console.log(payload);
		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
		res.json({ success: true, message: 'User login successfully!', accessToken });
		// res.json({ success: true, message: 'User login successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
