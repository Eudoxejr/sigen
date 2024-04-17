import React, {useEffect} from 'react';
import {useFieldArray, Controller} from "react-hook-form";
import {
    Button,
    Input
} from "@material-tailwind/react";
import Select from 'react-select';
import { AiFillEuroCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import { ClientApi } from "@/api/api";
import AsyncSelect from 'react-select/async';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import { FaFolder } from "react-icons/fa";
import Collapse from '@mui/material/Collapse';
import { animated, useSpring } from '@react-spring/web';
import IconButton from '@mui/material/IconButton';
import { IoMdAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { useDialogueStore } from '@/store/dialogue.store';


const StyledTreeItemLabel = styled(Typography)({
    color: 'inherit',
    // fontFamily: 'General Sans',
    fontWeight: 'inherit',
    flexGrow: 1,
  });

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.25)
        : theme.palette.primary.dark,
    color: theme.palette.mode === 'dark' && theme.palette.primary.contrastText,
    padding: theme.spacing(0, 1.2),
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}


const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
    const { labelIcon: LabelIcon, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            slots={{
                groupTransition: TransitionComponent,
            }}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <StyledTreeItemLabel className=' line-clamp-1 ' variant="body2">{labelText}</StyledTreeItemLabel>

                    <div className=" flex flex-row " >

                        {!other.delete &&
                            <IconButton
                                onClick={(e) => { other.onHandleDelete(), e.stopPropagation()}}
                            >
                                <FaTrash color="red" size={12} />
                            </IconButton>
                        }

                    </div>

                </Box>
            }
            {...other}
            ref={ref}
        />
    );
});

const NextedTreeItem = ({nextIndex, control, add, insertField }) => {

    const { fields:fieldGroupSub, append:appendGroupSub, remove:removeGroupSub } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `group[${nextIndex}].subChild`, // unique name for your Field Array
    });

    const { setDialogue } = useDialogueStore()

    return (

        <div className=" w-full flex flex-col mt-1 " >

            {fieldGroupSub.map((field, index) => (
                
                <StyledTreeItem 
                    itemId={`FoldersGen2${nextIndex}${index}`} 
                    labelIcon={FaFolder} 
                    labelText={field.name}
                    delete={!add}
                    onHandleDelete={() => removeGroupSub(index)}
                    onClick={() => insertField(field.name)}
                />
                
            ))}

            {add &&
                <button 
                    onClick={() => 
                        setDialogue({
                            size: "sm",
                            open: true,
                            view: "create-variable",
                            data: null,
                            functionAppendVariable: appendGroupSub
                        })
                    }
                    className=" w-[84%] line-clamp-1 self-end rounded-md font-medium text-[14px] pl-3 mt-1 mb-2 h-[32px] text-left bg-green-300 " 
                >
                    Ajouter
                </button>
            }

        </div>

    );
}

export default NextedTreeItem;
