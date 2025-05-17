
import tour from "../models/tourPlanModel.js";
import user from "../models/userModel.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

// create planATour
export const planATour = async (req, res) => {
    try {
        const { from, to, byVehicle, stops, listOfPersons, budget } = req.body;
        // const avatar = req.file;
        // if(!avatar){
        //     return res.status(400).json({message:"avtar required"})
        // }

        if (!from || !to || !byVehicle || !stops || !listOfPersons || !budget) {
            return res.status(400).json({ message: "All  fields are required" })
        }
       
        // Check if 'stops' and 'listOfPersons' are arrays and not empty
        if (!Array.isArray(stops) || stops.length === 0) {
            return res.status(400).json({ message: "'stops' must be a non-empty array" });
        }

        if (!Array.isArray(listOfPersons) || listOfPersons.length === 0) {
            return res.status(400).json({ message: "'listOfPersons' must be a non-empty array" });
        }

        // const avatarResult = await uploadOnCloudinary (avatar.path)
        // console.log(avatarResult);

        const newTour = new tour({
            from,
            to,
            byVehicle,
            stops,
            listOfPersons,
            budget,
        });

        await newTour.save();
        return res.status(201).json({ message: "Tour plan successfully", tour: newTour })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }

};



//updateTour

export const updateTour = async (req, res) => {
    try {
        const { from, to, byVehicle, budget, stops, listOfPerson } = req.body;
        const { userId } = req.params;
        if (!userId) {

            return res.status(400).json({ message: " user is missing" })
        }
       
       
        const fetchedUser = await user.findByIdAndUpdate(userId, {
            from,
            to,
            byVehicle,
            budget,
            stops,
            listOfPerson

        }, { new: true });
        if (!fetchedUser) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json({ message: "user update successfully", user: fetchedUser });
    } catch (error) {

        return res.status(500).json({ message: "Internal server error", error })
    }

};

// images upload 
export const imagesUpload = async (req, res) => {
    try {
      const authUser = req.user;
      
      // Check if the user is authorized
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const tourId = req.params.tourId;
      
      // Check if tourId is provided
      if (!tourId) {
        return res.status(400).json({ message: "TourId is missing" });
      }
  
      const images = req.files;
      
      // Check if at least one image is provided
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "At least one image is required!" });
      }
  
      // Prepare to store image URLs after upload
      let imagesUrls = [];
  
      // Use Promise.all to handle all image uploads
      const imageUploadPromises = images.map(async (image) => {
        const imageResult = await uploadOnCloudinary(image.path);
        return imageResult.secure_url;
      });
  
      // Wait for all image uploads to finish++
      imagesUrls = await Promise.all(imageUploadPromises);
  
      // Find the tour document by ID
      const fetchedTour = await tour.findById(tourId);
  
      if (!fetchedTour) {
        return res.status(404).json({ message: "Tour not found" });
      }
  
      // Assign the uploaded image URLs to the tour's images field
      fetchedTour.images = imagesUrls;
  
      // Save the updated tour document
      await fetchedTour.save();
  
      return res.status(200).json({
        message: "Images uploaded successfully!",
        tour: fetchedTour,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
   
  export const searchTour = async (req, res) => {
    try {
        const { place, date } = req.query;

       
        let searchFilter = {};
        if (place) searchFilter.Place = { $regex: place, $options: "i" };
        if (date) searchFilter.Date = { $regex: date, $options: "i" };
        const results = await user.find(searchFilter);

        if (!results.length) {
            return res.status(404).json({ message: "No matching tours found" });
        }

        return res.status(200).json({ message: "Search results", results });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

































    
 































































// getUserId

// export const getUserById = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         if (!userId) {
//             return res.status(400).json({ message: "userId is missing" })
//         }
//         const fetchedUser = await getUserById(userId, {
//             from,
//             to,
//             byVehicle,
//             budget,
//             stops,
//             listOfPerson

//         }, )
//         if (!fetchedUser) {
//             return res.status(404).json({ message: "user not found" })
//         }
//         return res.status(200).json({ message: "user fetched sucessfully", user })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "internal server error", error })
//     }
// };




















