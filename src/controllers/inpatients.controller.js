import { getConnection, sql } from '../database/connection';

export const getPatients = async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool.request().query(`SELECT 
			BA.MaBA,
			DMBN.HoDem,
			CASE
				WHEN TN.MaTheKCB <> '' THEN '1'
				ELSE '0'
			END [TypeBN],
			YEAR(DMBN.NgaySinh) [NamSinh],
			DMBN.GioiTinh,
			DMBN.DiaChi, 
			TN.CapCuu,
			BA.NgayBD [NgayVao],
			BA.MaKhoa,
			BA.PhongSo,
			DMBP.TenPhong,
			BA.GiuongSo,
			CASE
				WHEN BA.TrangThai = 'RAKHOA' THEN 1
				ELSE 0
			END [Ravien]
			FROM BANhapKhoa AS BA LEFT JOIN DMBuongPhong AS DMBP ON BA.PhongSo = DMBP.PhongSo
			INNER JOIN KBTiepNhan AS TN ON BA.MaPK = TN.MaPK
			INNER JOIN DMBenhNhan AS DMBN ON TN.MaBN = DMBN.MaBN WHERE CONVERT(DATE, BA.NgayBD) BETWEEN '2021-01-10' AND '2021-09-15'`);
		res.json({ success: true, patients: result.recordset });
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
		console.log(MaBA);
		const pool = await getConnection();
		await pool.request().query(
			`SELECT 
			MaDTri,
			Convert(varchar, NgayDTri, 25) [NgayDTri],
			DienBien,
			YLenh,
			NVTH
			FROM BADieuTri WHERE MaBA ='${MaBA}' AND LaPhieuDT = 0 ORDER BY NgayDTri DESC `,
			(error, result) => {
				if (error) {
					console.log(error);
				} else {
					res.json({ success: true, couponCares: result.recordset });
				}
				// res.json({ sucess: true, couponCares: result.recordset });
				// console.dir(result.rowsAffected);
			}
		);
	} catch (error) {}
};

export const saveCouponCare = async (req, res) => {
	try {
		const MaBA = req.query.MaBA;
		console.log(MaBA);
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
