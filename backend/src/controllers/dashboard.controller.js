import User from "../models/user.model.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import { Apierror } from "../utils/Apierror.js";
import Stock from "../models/stock.model.js";
import { asynchandler } from "../utils/Asynchandler.js";

const invested = asynchandler(async (req, res) => {
  try {
    const user = req.user; 
    if (!user) {
      throw new Apierror(401, {}, "User not authenticated");
    }

    const data = await User.findById(user._id); 
    if (!data) {
      throw new Apierror(404, {}, "User not found in DB");
    }

    const net_invest = data.total_invested;

    return res
      .status(200)
      .json(new Apiresponce(200, net_invest, "Invest amount fetched"));
  } catch (error) {
    throw new Apierror(500, {}, "Failed to fetch");
  }
});

const returns = asynchandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let actual_return = 0;

    for (let index = 0; index < user.stocks.length; index++) {
      const stockData = user.stocks[index]; 
      const stock = await Stock.findById(stockData.stock); 

      const perUnitPrice = stock.price_per_unit;
      //console.log(perUnitPrice)
      const quantity = stockData.quantity; 

      actual_return += (quantity * perUnitPrice);
    }
      actual_return = actual_return - user.total_invested

    return res.status(200).json(
      new Apiresponce(200, actual_return, "total return")
    );

  } catch (error) {
    console.log(error);
    throw new Apierror(500, "error while calculating ACTUAL RETURN");
  }
});


const current_value = asynchandler(async(req,res)=>{
  try {
    const user = await User.findById(req.user._id);

    let current_value = 0;

    for (let index = 0; index < user.stocks.length; index++) {
      const stockData = user.stocks[index]; 
      const stock = await Stock.findById(stockData.stock); 

      const perUnitPrice = stock.price_per_unit;
      const quantity = stockData.quantity; 

      current_value += (quantity * perUnitPrice);
    }
      

    return res.status(200).json(
      new Apiresponce(200, current_value, "total current value")
    );

  } catch (error) {
    console.log(error);
    throw new Apierror(500, "error while calculating current value");
  }
})

const wallet_balance = asynchandler(async(req,res)=>{
  try {
    const user = await User.findById(req.user._id)
    const wallet_balance = user.wallet_money;
    return res.status(200).json(new Apiresponce(200,wallet_balance,"{wallet ballance fetched}"))
    
  } catch (error) {
    throw new Apierror(501,"error in wallet")
  }
})

export  {invested,returns,current_value,wallet_balance};
