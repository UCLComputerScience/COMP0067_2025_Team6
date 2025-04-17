import { NextResponse } from "next/server";
 import { PrismaClient } from "@prisma/client";
 
 const prisma = new PrismaClient();
 
 export async function GET() {
   try {
     const thresholds = await prisma.defaultThreshold.findMany();
     console.log("GET /api/controls/settings - Fetched:", thresholds.length, "thresholds");
     return NextResponse.json({ fields: thresholds });
   } catch (error) {
     console.error("GET /api/controls/settings - Error:", error);
     return NextResponse.json(
       { error: `Failed to fetch default thresholds: ${(error as Error).message}` },
       { status: 500 }
     );
   } finally {
     await prisma.$disconnect();
   }
 }
 
 export async function POST(request: Request) {
   try {
     const { fields } = await request.json();
 
     if (!fields || !Array.isArray(fields)) {
       return NextResponse.json({ error: "Invalid fields data" }, { status: 400 });
     }
 
     // Validate fields
     const invalidFields = fields.filter(
       (field) =>
         !field.fieldName ||
         isNaN(Number(field.minValue)) ||
         isNaN(Number(field.maxValue)) ||
         Number(field.minValue) > Number(field.maxValue)
     );
     if (invalidFields.length > 0) {
       return NextResponse.json(
         {
           error:
             "All fields must have a valid name and numeric min/max values, with min less than max",
         },
         { status: 400 }
       );
     }
 
     // Get existing thresholds
     const existingThresholds = await prisma.defaultThreshold.findMany({
       select: { fieldName: true },
     });
     const existingFieldNames = existingThresholds.map((t) => t.fieldName);
     const submittedFieldNames = fields.map((f) => f.fieldName);
 
     // Identify thresholds to delete 
     const thresholdsToDelete = existingFieldNames.filter(
       (fieldName) => !submittedFieldNames.includes(fieldName)
     );
 
     // Delete removed thresholds
     if (thresholdsToDelete.length > 0) {
       await prisma.defaultThreshold.deleteMany({
         where: {
           fieldName: { in: thresholdsToDelete },
         },
       });
       console.log(
         "POST /api/controls/settings - Deleted thresholds:",
         thresholdsToDelete
       );
     }
 
     // Upsert submitted thresholds
     const upsertPromises = fields.map((field) =>
       prisma.defaultThreshold.upsert({
         where: { fieldName: field.fieldName },
         update: {
           minValue: Number(field.minValue),
           maxValue: Number(field.maxValue),
           unit: field.unit || null,
         },
         create: {
           fieldName: field.fieldName,
           minValue: Number(field.minValue),
           maxValue: Number(field.maxValue),
           unit: field.unit || null,
         },
       })
     );
 
     const updatedThresholds = await Promise.all(upsertPromises);
     console.log(
       "POST /api/controls/settings - Updated/Created:",
       updatedThresholds.length,
       "thresholds"
     );
     return NextResponse.json({ fields: updatedThresholds });
   } catch (error) {
     console.error("POST /api/controls/settings - Error:", error);
     return NextResponse.json(
       { error: `Failed to save default thresholds: ${(error as Error).message}` },
       { status: 500 }
     );
   } finally {
     await prisma.$disconnect();
   }
 }