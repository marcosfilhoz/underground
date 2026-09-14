import ExcelJS from "exceljs";

type ExcelReportBody = {
  logo?: string;
  rows?: string[][];
  title?: string;
};

function logoExtension(logo: string) {
  const match = logo.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
  const rawType = (match?.[1] ?? "png").toLowerCase();

  if (rawType === "jpeg" || rawType === "jpg") {
    return "jpeg" as const;
  }

  if (rawType === "gif") {
    return "gif" as const;
  }

  return "png" as const;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ExcelReportBody;
  const title = body.title?.trim() || "Report";
  const rows = body.rows ?? [];
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");
  let currentRow = 1;

  if (body.logo) {
    const base64 = body.logo.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");

    if (base64) {
      const imageId = workbook.addImage({
        base64,
        extension: logoExtension(body.logo),
      });
      sheet.addImage(imageId, {
        ext: { height: 64, width: 128 },
        tl: { col: 0, row: 0 },
      });
      currentRow = 5;
    }
  }

  sheet.mergeCells(`A${currentRow}:D${currentRow}`);
  sheet.getCell(`A${currentRow}`).value = "Sys Underground";
  sheet.getCell(`A${currentRow}`).font = { bold: true, size: 18 };
  currentRow += 1;

  sheet.mergeCells(`A${currentRow}:D${currentRow}`);
  sheet.getCell(`A${currentRow}`).value = title;
  sheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
  currentRow += 2;

  rows.forEach((row) => {
    sheet.getRow(currentRow).values = [undefined, ...row];
    currentRow += 1;
  });

  sheet.columns = Array.from({ length: 8 }, () => ({ width: 22 }));

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}.xlsx`;

  return new Response(Buffer.from(buffer), {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
