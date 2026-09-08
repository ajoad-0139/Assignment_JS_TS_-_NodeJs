//Property handlers

//product items 
import HIGHEST_PRICE from "../../resources/properties/highest_price.json" with { type: "json" };
import LOWEST_PRICE from "../../resources/properties/lowest_price.json" with { type: "json" };
import MOST_POPULAR from "../../resources/properties/most_popular.json" with { type: "json" };

export const getProperty = async(req, res) =>{

    //Query parameters
    const {
        "most-popular": mostPopular,
        "highest-price": highestPrice,
        "lowest-price": lowestPrice,
        limit
    } = req.query;

    // initializing items 
    const items =[];

    //populating items based on query params 
    if(mostPopular) {
        // checking a valid limit property
        const LIMIT = limit === undefined? MOST_POPULAR.Result.Items.length: Number(limit);

        items.push(...MOST_POPULAR.Result.Items.slice(0,LIMIT));
    }
    else if(highestPrice) {
        // checking a valid limit property
        const LIMIT = limit === undefined? MOST_POPULAR.Result.Items.length: Number(limit);

        items.push(...HIGHEST_PRICE.Result.Items.slice(0,LIMIT));
    }
    else if(lowestPrice) {
        // checking a valid limit property
        const LIMIT = limit === undefined? MOST_POPULAR.Result.Items.length: Number(limit);

        items.push(...LOWEST_PRICE.Result.Items.slice(0,LIMIT));
    }

    return res.status(200).json({success:true, data:[...items]});
}