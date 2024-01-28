const Accessory = require('../models/Accessory');
const Cube = require('../models/Cube');

exports.getAll = () => Cube.find();

exports.addCube = (newCube) => Cube.create(newCube);

exports.getById = (id) => Cube.findById(id).populate('accessories');

exports.getByIdWithAvailableAcc = async (id) => {
    const cube = await Cube.findById(id).lean();

    const availableAccessories = await Accessory.find({ _id: { $nin: cube.accessories} }).lean();

    cube.availableAccessories = availableAccessories;

    return cube;
}

exports.attach = (cubeId, accId) => Cube.findByIdAndUpdate(cubeId, { $push: { accessories: accId } });

exports.search = (name, from, to) => {
    let result = {};

    if (name) {
        result.name = new RegExp(name, 'i');
    }

    if (from) {
        result.difficulty = { ...result.difficulty, $gte: from };
    }

    if (to) {
        result.difficulty = { ...result.difficulty, $lte: to };
    }

    return Cube.find(result);
};