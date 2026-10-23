require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Conectado exitosamente a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

const empleadoSchema = new mongoose.Schema({
  clave: Number,
  nombre: String,
  direccion: String,
  fechadenacimiento: Date,
  sexo: String, // Puede almacenar texto (ej. "M" / "F") o puedes cambiarlo a Number si prefieres un código numérico
  tipodesangre: String
});

const Empleado = mongoose.model('Empleado', empleadoSchema, 'empleados');

// 1. Endpoint POST: Crear un nuevo empleado
app.post('/api/empleados', async (req, res) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const guardado = await nuevoEmpleado.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// 2. Endpoint GET (Todos): Obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Endpoint GET (Uno por ID): Obtener un empleado específico
app.get('/api/empleados/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// 3. Endpoint PUT: Actualizar un empleado por ID
app.put('/api/empleados/:id', async (req, res) => {
  try {
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!empleadoActualizado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json(empleadoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// 4. Endpoint DELETE: Eliminar un empleado por ID
app.delete('/api/empleados/:id', async (req, res) => {
  try {
    const empleadoEliminado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleadoEliminado) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }
    res.json({ mensaje: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));