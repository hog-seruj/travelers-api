import { model, Schema } from 'mongoose';


//Створимо схему для документа categorie. Для цього використаємо клас Schema з бібліотеки mongoose:
const categorieSchema=new Schema(
   {
    name: {
        type: String,
        required: true},
  },
  { timestamps: true,
    versionKey: false,
   }
);


//Створимо модель Categorie на основі нашої схеми:
export const Categorie =model('Categorie', categorieSchema);



// categoriesSchema.index({ name: 1 }, { unique: true, collation: { locale: 'uk', strength: 2 } });

// //Опис роута GET /notes, який буде повертати масив усіх нотаток:
// router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);
