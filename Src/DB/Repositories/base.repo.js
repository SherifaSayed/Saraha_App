
export class BaseRepository
{
 constructor(model)
 {
    this.model=model;
 }
   creatDocument(data)
  {
    return this.model.create(data)
  }

  findOneDocument(filters, select={})
  {
   return this.model.findOne(filters).select(select)
  }

  findDocumentById(id)
  {

   return this.model.findById(id)
  }

  updateDocumentById(id,data)
  {
    
    return this.model.findOneAndUpdate({_id:id},data,{new:true,runValidators: true })
  }
  deletDocumentById()
  {

  }
  deletMultipleDocumentes()
  {

  }



}

