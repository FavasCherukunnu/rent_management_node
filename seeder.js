import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();


// Import Data
const importData = async () => {
    try {


        // Insert data into the Admin table
        const newAdmin = await prisma.m05_user.create({
            data: {
                m05_name: 'favas',
                m05_email: 'mhdfavascheru@gmail.com',
                m05_password: '123456', // Ensure you hash passwords in real applications!
                m05_contact:'7994020923'
            },
        });

        console.log('Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};


// Delete Data
const deleteData = async () => {
    try {
        // Clear existing data
        await ShippingMethod.deleteMany()

        console.log('Data Destroyed Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};




// Process arguments to determine action
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}

