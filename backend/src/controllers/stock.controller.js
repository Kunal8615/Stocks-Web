import User from "../models/user.model.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import Stock from "../models/stock.model.js";

const createStock = asynchandler(async (req, res) => {
    try {
        const {name, description, price_per_unit, available_quantity, category } = req.body;
        console.log(req.body);
      const user = await User.findById(req.user._id);
      if (!user || user.role !== "admin") {
        throw new Apierror(403, "Only admin can list a stock");
      }
  
      // Extract fields from request body
  
      // Optional: validate that all required fields exist
      if (!name || !description || !price_per_unit || !available_quantity || !category) {
        throw new Apierror(400, "All stock fields are required");
      }
  
      const create = await Stock.create({
        name,
        description,
        price_per_unit,
        available_quantity,
        category,
        owner: req.user._id,
      });
  
      return res
        .status(201)
        .json(new Apiresponce(201, {create,user}, "Stock has been created"));
  
    } catch (error) {
      console.error("Error while creating stock:", error);
      throw new Apierror(500, "Something went wrong while creating stock");
    }
  });
  

  const buy_stock = asynchandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const { stockid, total_unit } = req.body;
  
      const stock = await Stock.findById(stockid);
      if (!stock) {
        throw new Apierror(404, "Stock not found in DB");
      }
  
      const pay = total_unit * stock.price_per_unit;
  
      // Balance check
      if (pay > user.wallet_money) {
        window.alert ("Insufficient balance in Virtual Wallet")
        throw new Apierror(401, "Insufficient balance in Virtual Wallet");
      }
  
      // Stock availability check
      if (total_unit > stock.available_quantity) {
        throw new Apierror(400, "Not enough stock available");
      }
  
      // Update user
      user.wallet_money -= pay;
      user.total_invested += pay;
      user.stocks.push({ stock: stockid, quantity: total_unit });
      await user.save();
  
      // Update stock
      stock.available_quantity -= total_unit;
      stock.invested_amount += pay;
      stock.investor_count += 1;
      await stock.save();
  
      return res.status(200).json(
        new Apiresponce(
          200,
          { user, stock },
          `Payment Successful for ${stock.name} by $${user.name}`
        )
      );
    } catch (error) {
      console.log(error);
      throw new Apierror(500, "Problem in stock while buying");
    }
  });
  
  const update_stock = asynchandler(async (req, res) => {
    try {
      const { stockid, new_price } = req.body;
  
      let pre_price = 0;
      const preStock = await Stock.findById(stockid);
  
      if (!preStock) {
        return res.status(404).json(new Apiresponce(404, null, "Stock not found"));
      }
  
      pre_price = preStock.price_per_unit;
  
      const stock = await Stock.findByIdAndUpdate(
        stockid,
        { price_per_unit: new_price },
        { new: true, runValidators: true }
      );
  
      return res.status(200).json(
        new Apiresponce(200, stock.price_per_unit, `Price updated from ${pre_price} to ${stock.price_per_unit}`)
      );
      
    } catch (error) {
      console.log(error);
      throw new Apierror(500, "Error while updating stock price");
    }
  });
  

  const getStockDetail = asynchandler(async (req, res) => {
    try {
      const { stockid } = req.body || req.query   // dono jagah se id aa sakti hai
      
      if (!stockid) {
        return res
          .status(400)
          .json(new Apiresponce(400, null, "stockid is required"))
      }
  
      const stock = await Stock.findById(stockid)
  
      if (!stock) {
        return res
          .status(200) 
          .json(new Apiresponce(200, null, "Stock not found"))
      }
  
      return res
        .status(200)
        .json(new Apiresponce(200, stock, "Stock detail fetched"))
    } catch (error) {
      console.error("Error in getStockDetail:", error.message)
      return res
        .status(500)
        .json(new Apiresponce(500, null, "Internal server error"))
    }
  })
  

  const getAllStocks = asynchandler(async (req, res) => {
    try {
      const stocks = await Stock.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            price_per_unit : 1,
            available_quantity : 1,
            description : 1,
            invested_amount : 1,
            investor_count : 1
          }
        }
      ]);
  
      return res.status(200).json(
        new Apiresponce(200, stocks, "All stocks fetched successfully")
      );
  
    } catch (error) {
      console.log(error);
      throw new Apierror(500, "Error fetching stocks");
    }
  });

  const searchStock = asynchandler(async(req,res)=>{
    try {
      const { searchQuery } = req.query;

      // ✅ Search query validation
      if (!searchQuery) {
          throw new Apierror(400, "Search query is required");
      }

      const data = await Stock.aggregate([
          {
              $match: {
                  name: { $regex: searchQuery, $options: 'i' }
              }
          },
          {
              $limit: 5 
          },
         
      ]);

      console.log(data);

      // ✅ Empty data handling
      if (!data || data.length === 0) {
          throw new Apierror(404, "No matching data found.");
      }

      // ✅ Successful response
      return res.status(200).json(new Apiresponce(200, data, "Data fetched successfully"));
      
  } catch (error) {
      return res.status(error.statusCode || 500).json(
          new Apiresponce(error.statusCode || 500, null, error.message || "Error occurred in SearchData")
      );
  }
  })
  

export { createStock ,buy_stock,update_stock,getStockDetail,getAllStocks,searchStock};
