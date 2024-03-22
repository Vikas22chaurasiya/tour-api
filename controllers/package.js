import Package from "../models/Package.js";


export const createPackage = async (req, res, next) => {
  const newPackage = new Package(req.body);

  try {
    const savedPackage = await newPackage.save();
    res.status(200).json(savedPackage);
  } catch (err) {
    next(err);
  }
};
export const updatePackage = async (req, res, next) => {
  try {
    const updatedpackage = await Package.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedpackage);
  } catch (err) {
    next(err);
  }
};
export const deletePackage = async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.status(200).json("Package has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getPackage = async (req, res, next) => {
  try {
    const package1 = await Package.findById(req.params.id);
    res.status(200).json(package1);
  } catch (err) {
    next(err);
  }
};
export const getPackages = async (req, res, next) => {
  const { min, max, city,mainstyle,...others } = req.query;
  try {
    const packages = await Package.find({
      ...others,
      Destination:{ "$regex": city|| '', "$options": "i" },
      Main_style:{"$regex": mainstyle|| ''},
      Price: { $gt: min | 1, $lt: max || 999 },
    }).sort({ Review: -1 }).limit(req.query.limit);
    res.status(200).json(packages);
  } catch (err) {
    next(err);
  }

 
};


export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Package.countDocuments({ Destination: { "$regex": city, "$options": "i" } });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const Count1 = await Package.countDocuments({ Main_style: "In-depth Cultural" });
    const Count2 = await Package.countDocuments({ Main_style: "Explorer" });
    const Count3 = await Package.countDocuments({ Main_style: "Active Adventure" });
    const Count4 = await Package.countDocuments({ Main_style: "Safari" });
    const Count5 = await Package.countDocuments({ Main_style: "Wildlife" });

    res.status(200).json([
      { type: "In-depth Cultural", count: Count1 },
      { type: "Explorers", count: Count2 },
      { type: "Active Adventure", count: Count3 },
      { type: "Safari", count: Count4 },
      { type: "Wildlife", count: Count5 },
    ]);
  } catch (err) {
    next(err);
  }
};

