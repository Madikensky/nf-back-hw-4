import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URL ||
        'mongodb+srv://madikensky:madik123@crud-db.16vyggb.mongodb.net/?retryWrites=true&w=majority&appName=crud-db'
    );
    console.log('MongoDB connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
