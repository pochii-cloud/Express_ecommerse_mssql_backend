import {Response,Request, RequestHandler } from "express";
import { sqlConfig } from "../config";
import mssql from 'mssql'
import bcrypt from 'bcrypt';
import {v4 as uid} from 'uuid'
import { DatabaseHelper } from "../Helpers";
interface ExtendedRequest extends Request{
    body:{
        id:string,
        name:string,
        description:string,
        price:string,
        images:string,
        user_id:string
    }
}
interface PRODUCT {
    id:string,
    name :string,
    description:string,
    images:string,
    price:string
}


export const addProduct:RequestHandler = async (req:ExtendedRequest,res:Response)=>{
  try {
    const id = uid();
    const {name,description,price,images,user_id} = req.body;
     //connect to database
     await DatabaseHelper.exec('AddProduct',{name,description,price,images,user_id})
    //  let pool=await mssql.connect(sqlConfig)
    //  await pool.request()
    //  .input('id',mssql.VarChar,id)
    //  .input('name',mssql.VarChar,name)
    //  .input('description',mssql.VarChar,description)
    //  .input('price',mssql.VarChar,price)
    //  .input('images',mssql.VarChar,images)
    //  .execute('AddProduct')
     
     return res.status(201).json({message:"product added"})
  } catch (error:any) {
    res.status(500).json(error.message)
  }

}

export const getAllProductsController:RequestHandler=async(req,res)=>{
    
    try {
        
      let products:PRODUCT[] = await (await DatabaseHelper.exec('getProducts',{})).recordset
        // const pool =  await mssql.connect(sqlConfig)
        // let products:PRODUCT[] =(await (await pool.request()).execute('getProducts')).recordset
        res.status(200).json(products)
    } catch (error:any) {
         //server side error
         return res.status(500).json(error.message)
    }
}


export const getSingleProduct=async(req:Request<{id:string}>,res:Response)=>{
   try {
       let {id}=req.params
       let product:PRODUCT[] = await (await DatabaseHelper.exec('getSingleProduct',{id})).recordset
       //connect to database
      //  let pool=await mssql.connect(sqlConfig)
       
      //  let product:PRODUCT[]=await (await pool.request().input('id',mssql.VarChar,id).execute('getSingleProduct')).recordset

       if(product.length>0){
        res.status(200).json(product)
       }else{
        res.status(500).json({message:"product does not exist"})
       }
      


   } catch (error:any) {
    res.status(500).json(error.message)
   }

}

export const deleteProduct=async(req:Request<{id:string}>,res:Response)=>{

    try {
         
        let {id}=req.params
        let prod = await DatabaseHelper.exec('deleteProduct',{id})
      //   let pool=await mssql.connect(sqlConfig)
      //  let prod = await pool.request().input('id',id).execute('deleteProduct')
        if(prod.rowsAffected[0]>0){
          res.status(200).json({message:"product deleted successfully"})
        }
        else{
          res.status(404).json({message:"product does not exist"})
        }

    }
    catch(error:any){
         res.status(500).json(error.message)
    } 
}

export const updateProduct = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, price, images } = req.body;
      const pool = await mssql.connect(sqlConfig);
      let product =  await DatabaseHelper.exec('updateProduct',{id,name,description,price,images})
      if(product.rowsAffected[0]>0){
        res.status(200).json({ message: "product updated successfully" });
      }
      else{
        res.status(404).json({message:"not found"})
      }
      // let product=await (await pool
      //   .request()
      //   .input("id", mssql.VarChar(100), id)
      //   .input("name", mssql.VarChar(100), name)
      //   .input("description", mssql.VarChar(1000), description)
      //   .input("price", mssql.VarChar(100), price)
      //   .input("images", mssql.VarChar(200), images)
      //   .execute("updateProduct")).recordset
     
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  };
  
