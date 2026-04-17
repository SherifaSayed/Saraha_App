
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
findDocument(filters={}, select={})
{

  return this.model.find(filters).select(select);
}

updateManyDocuments({filters, data, options}){
  return this.model.updateMany(filters, data, options)
}
 updateDocumentById(id,data)
  {
    
    return this.model.findOneAndUpdate({_id:id},data,{returnDocument:"after",runValidators: true })
  }
  hardDeleteDocumentById(id)
  {

   return this.model.findeOneAndDelete({_id:id})
  }
hardDeletDocument(filters)
{
  return this.model.deleteOne(filters);
}
  softDeleteDocumentById(filter)
  {
    return this.model.findOneAndUpdate({filter, isDeleted:false},
      {$set:{isDeleted:true, deletedAt:new Date()}}
      ,{new:true});
  }
  hardDeleteMultipleDocumentes({filters})
  {
   return this.model.deleteMany(filters)
  }
 softDeleteMultipleDocumentsById(ids)
 {
 return this.model.updateMany({_id:{$in:ids}, isDeleted:false},
  {$set:{isDeleted:true}, deletedAt:new Date()});
 }
deletAll()
{
   return this.model.deleteMany({});
}


contDocuments(filters)
{
  return this.model.contDocuments(filters);

}


}

