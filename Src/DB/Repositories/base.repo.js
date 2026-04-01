
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
  hardDeleteDocumentById()
  {

   return this.model.findeOneAndDelete({_id:id})
  }

  softDeleteDocumentById(id)
  {
    return this.model.findOneAndUpdate({_id:id, isDeleted:false},
      {$set:{isDeleted:true, deletedAt:new Date()}}
      ,{new:true});
  }
  hardDeleteMultipleDocumentes(ids)
  {
   return this.model.deleteMany({_id:{$in:ids}})
  }
 softDeleteMultipleDocumentsById(ids)
 {
 return this.model.updateMany({_id:{$in:ids}, isDeleted:false},
  {$set:{isDeleted:true}, deletedAt:new Date()});
 }
}

