import { getConnection, sql } from '../database/connection';

export const getPatients = async (req, res) => {
	try {
		const { department, room, patientStatus, patientType, BANumber, dateFrom, dateTo, date } = req.query;
		console.log(department, room, patientStatus, patientType, BANumber, dateFrom, dateTo, date);
		const pool = await getConnection();
		await pool
			.request()
			.input('Department', sql.VarChar(50), department)
			.input('Room', sql.VarChar(50), room)
			.input('PatientStatus', sql.VarChar(50), patientStatus)
			.input('PatientType', sql.VarChar(50), patientType)
			.input('BANumber', sql.VarChar(50), BANumber)
			.input('DateFrom', sql.VarChar(50), dateFrom)
			.input('DateTo', sql.VarChar(50), dateTo)
			.input('Date', sql.VarChar(50), date)
			.execute('GetInpatients', (err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log(result.recordset.length);
					res.json({ success: true, inpatients: result.recordset });
				}
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const getPatientByMaBA = async (req, res) => {
	const maBA = req.params.id;
	try {
		const pool = await getConnection();
		const result = await pool.request().query(`SELECT 
			BA.MaBA,
			DMBN.HoDem,
			TN.MaTheKCB,
			CASE
				WHEN TN.MaTheKCB <> '' THEN '1'
				ELSE '0'
			END [TypeBN],
			YEAR(DMBN.NgaySinh) [NamSinh],
			DMBN.GioiTinh,
			DMBN.DiaChi,
			DMKP.TenKhoa,
			DMNV.TenNV [BSDieuTri],
			BA.TenCDoan,
			DMBP.TenPhong,
			BA.GiuongSo,
			CASE
				WHEN BA.TrangThai = 'RAKHOA' THEN 1
				ELSE 0
			END [Ravien]
			FROM BANhapKhoa AS BA LEFT JOIN DMBuongPhong AS DMBP ON BA.PhongSo = DMBP.PhongSo
			INNER JOIN KBTiepNhan AS TN ON BA.MaPK = TN.MaPK
			INNER JOIN DMBenhNhan AS DMBN ON TN.MaBN = DMBN.MaBN 
			INNER JOIN DMNhanVien  AS DMNV ON BA.BSDieuTri = DMNV.MaNV
			INNER JOIN DMKhoaPhong AS DMKP ON BA.MaKhoa = DMKP.MaKhoa WHERE BA.MaBA = '${maBA}'`);
		res.json({ success: true, patient: result.recordset });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export const getCouponCares = async (req, res) => {
	try {
		const MaBA = req.query.MaBA;
		const TimeFrom = req.query.TimeFrom;
		const TimeTo = req.query.TimeTo;
		console.log(MaBA, TimeFrom, TimeTo);
		let query = '';
		const pool = await getConnection();
		if (TimeFrom === undefined && TimeTo === undefined) {
			query = `SELECT 
				MaDTri,
				Convert(varchar, NgayDTri, 25) [NgayDTri],
				DienBien,
				YLenh,
				NVTH
				FROM BADieuTri WHERE MaBA ='${MaBA}' AND LaPhieuDT = 0 ORDER BY NgayDTri DESC `;
		} else {
			query = `SELECT 
				MaDTri,
				Convert(varchar, NgayDTri, 25) [NgayDTri],
				DienBien,
				YLenh,
				NVTH
				FROM BADieuTri WHERE MaBA ='${MaBA}' AND (NgayDTri BETWEEN '${TimeFrom}' AND '${TimeTo}') AND LaPhieuDT = 0 ORDER BY NgayDTri DESC `;
		}
		console.log(query);
		await pool.request().query(query, (error, result) => {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
				res.json({ success: true, couponCares: result.recordset });
			}
			// res.json({ sucess: true, couponCares: result.recordset });
			// console.dir(result.rowsAffected);
		});
	} catch (error) {}
};

export const saveCouponCare = async (req, res) => {
	try {
		const MaBA = req.query.MaBA;
		const { couponCode, time, happen, commands, user } = req.body;
		console.log(req.body);
		const pool = await getConnection();
		await pool
			.request()
			.input('MaBA', sql.VarChar(50), MaBA)
			.input('NgayDT', sql.VarChar(50), time)
			.input('DienBien', sql.NVarChar(1000), happen)
			.input('YLenh', sql.NVarChar(1000), commands)
			.input('NVTH', sql.VarChar(50), user)
			.output('MaDieuTri', sql.VarChar(50), couponCode)
			.execute('CreatePhieuChamSoc', (err, result) => {
				if (err) {
					console.log(err);
				} else {
					res.json({ success: true, MaDTri: result.output.MaDieuTri });
				}
			});
	} catch (error) {
		console.log(error);
	}
};
export const DeleteCouponCare = async (req, res) => {
	try {
		const MaBA = req.query.MaBA;
		const MaDTri = req.query.MaDTri;
		console.log(MaBA, MaDTri);
		const pool = await getConnection();
		await pool.request().query(`DELETE BADieuTri WHERE MaBA ='${MaBA}' AND MaDTri = '${MaDTri}'`, (error, result) => {
			if (error) {
				console.log(error);
			} else {
				res.json({ success: true, couponCares: result.recordset });
			}
		});
	} catch (error) {
		console.log(error);
	}
};
