import Category from "../database/models/category";



class CategoryController {
    categoryData = [
        {
            categoryName: "Medicines & Health"
        },
        {
            categoryName: "Vitamins & Supplements"
        },
        {
            categoryName: "Beauty & Personal Care"
        },
        {
            categoryName: "Ayurvedic & Herbal"
        },
        {
            categoryName: "Healthcare Devices"
        }
    ]
    async seedCategory():Promise<void>{
        const datas = await Category.findAll()
        if(datas.length === 0){
             const data = await Category.bulkCreate(this.categoryData)
             console.log("Categories data seeded sucessfully");
             
        }
        else{
            console.log("Categories already seeded");
            
        }
       
    }
}

export default new CategoryController();
