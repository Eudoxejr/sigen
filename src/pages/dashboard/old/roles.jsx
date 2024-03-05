import * as React from 'react';
import { Link } from 'react-router-dom';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Roles() {

  return (


    <div className='m-[200px]'>

        <h1 className='ml-4 font-bold'>Roles / Permissions</h1>

        <div className='flex'>
      
        <Link to={'/dashboard/old/add-role'} className='m-4 flex justify-center items-center border border-[#ddd] p-5 rounded-lg cursor-pointer hover:border-secondary hover:bg-secondary transition-all duration-500'>
            <AddCommentIcon style={{fontSize:50, color : '#2C93EB'}} />
        </Link>

        <div className='m-4 border border-[#ddd] p-5 rounded-lg'>
            
            <div className='flex items-center'>
                 <ControlPointDuplicateIcon style={{fontSize:40, color:'#636e72'}} />
                 <div className='ml-4'>
                    <h3 className='font-semibold'>Admin</h3>
                    <h4 className='mt-3'> <span className='bg-secondary rounded-sm p-1 text-primary'>08 Permissions</span></h4>

                    <div className='flex justify-end mt-3'>
                        <div>
                            <DeleteForeverIcon style={{backgroundColor:'red', borderRadius:'4px', padding:'3px', color: '#fff', margin:'2px', cursor: 'pointer'}} />
                            <Link to={'/dashboard/old/add-role'}>
                                 <EditIcon style={{backgroundColor:'2C93EB', borderRadius:'4px', padding:'3px', color: '#fff', margin:'1px', cursor: 'pointer'}} />
                            </Link>
                        </div>
                    </div>

                 </div>
            </div>
           
        </div>

        <div className='m-4 border border-[#ddd] p-5 rounded-lg'>
            
            <div className='flex items-center'>
                 <ControlPointDuplicateIcon style={{fontSize:40, color:'#636e72'}} />
                 <div className='ml-4'>
                    <h3 className='font-semibold'>Notaire</h3>
                    <h4 className='mt-3'><span className='bg-secondary rounded-sm p-1 text-primary'>04 Permissions</span></h4>

                    <div className='flex justify-end mt-3'>
                        <div>
                            <DeleteForeverIcon style={{backgroundColor:'red', borderRadius:'4px', padding:'3px', color: '#fff', margin:'2px', cursor: 'pointer'}} />
                            <Link to={'/dashboard/old/add-role'}>
                                 <EditIcon style={{backgroundColor:'2C93EB', borderRadius:'4px', padding:'3px', color: '#fff', margin:'1px', cursor: 'pointer'}} />
                            </Link>
                        </div>
                    </div>

                 </div>
            </div>
           
        </div>

        <div className='m-4 border border-[#ddd] p-5 rounded-lg'>
            
            <div className='flex items-center'>
                 <ControlPointDuplicateIcon style={{fontSize:40, color:'#636e72'}} />
                 <div className='ml-4'>
                    <h3 className='font-semibold'>Superviseur</h3>
                    <h4 className='mt-3'><span className='bg-secondary rounded-sm p-1 text-primary'>07 Permissions</span></h4>

                    <div className='flex justify-end mt-3'>
                        <div>
                            <DeleteForeverIcon style={{backgroundColor:'red', borderRadius:'4px', padding:'3px', color: '#fff', margin:'2px', cursor: 'pointer'}} />
                            <Link to={'/dashboard/old/add-role'}>
                                 <EditIcon style={{backgroundColor:'2C93EB', borderRadius:'4px', padding:'3px', color: '#fff', margin:'1px', cursor: 'pointer'}} />
                            </Link>
                        </div>
                    </div>


                 </div>
            </div>
           
        </div>

        <div className='m-4 border border-[#ddd] p-5 rounded-lg'>
            
            <div className='flex items-center'>
                 <ControlPointDuplicateIcon style={{fontSize:40, color:'#636e72'}} />
                 <div className='ml-4'>
                    <h3 className='font-semibold'>Moniteur</h3>
                    <h4 className='mt-3'><span className='bg-secondary rounded-sm p-1 text-primary'>12 Permissions</span></h4>

                    <div className='flex justify-end mt-3'>
                        <div>
                            <DeleteForeverIcon style={{backgroundColor:'red', borderRadius:'4px', padding:'3px', color: '#fff', margin:'2px', cursor: 'pointer'}} />
                            <Link to={'/dashboard/old/add-role'}>
                                 <EditIcon style={{backgroundColor:'2C93EB', borderRadius:'4px', padding:'3px', color: '#fff', margin:'1px', cursor: 'pointer'}} />
                            </Link>
                        </div>
                    </div>


                 </div>
            </div>
           
        </div>
        </div>


        
    </div>


  );
}