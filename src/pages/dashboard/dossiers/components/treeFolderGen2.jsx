import React, { useEffect } from 'react';
import { useFieldArray, Controller } from "react-hook-form";
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
            : theme.palette.grey[400],
    position: 'relative',
    [`& .${treeItemClasses.content}`]: {
        flexDirection: 'row-reverse',
        borderRadius: theme.spacing(0.7),
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
        padding: theme.spacing(0.5),
        paddingRight: theme.spacing(1),
        fontWeight: 500,
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
        },
        [`& .${treeItemClasses.iconContainer}`]: {
            marginRight: theme.spacing(2),
        },
        [`&.Mui-expanded `]: {
            '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.dark,
            },
            '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                left: '16px',
                top: '44px',
                height: 'calc(100% - 48px)',
                width: '1.5px',
                backgroundColor:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[300]
                        : theme.palette.grey[700],
            },
        },
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
        },
        [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
            backgroundColor:
                theme.palette.mode === 'light'
                    ? theme.palette.primary.main
                    : theme.palette.secondary.dark,
            color: 'white',
        },
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
        [`& .${treeItemClasses.content}`]: {
            fontWeight: 500,
        },
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

                        {/* {other.add &&
                            <IconButton
                                // onClick={handleClick}
                            >
                                <IoMdAdd size={18} />
                            </IconButton>
                        } */}

                        {!other.delete &&
                            <IconButton
                                onClick={(e) => { other.onHandleDelete(), e.stopPropagation() }}
                            >
                                <FaTrash color="red" size={15} />
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

const TreeFolderGen2 = ({ nextIndex, control, add, errors }) => {

    const { fields: folderGen2, append: appendFolderGen2, remove: removeFolderGen2 } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `subFoldersGen1[${nextIndex}].subFoldersGen2`, // unique name for your Field Array
    });

    const { setDialogue } = useDialogueStore()

    return (

        <div className=" w-full flex flex-col mt-1 " >

            {folderGen2.map((field, index) => (

                <StyledTreeItem
                    key={`FoldersGen2${nextIndex}${index}`}
                    itemId={`FoldersGen2${nextIndex}${index}`}
                    labelIcon={FaFolder}
                    labelText={field.folderName}
                    delete={!add}
                    onHandleDelete={() => removeFolderGen2(index)}
                />

            ))}

            {add &&
                <button
                    onClick={() => {
                        setDialogue({
                            size: "sm",
                            open: true,
                            view: "add-sub-folder",
                            data: null,
                            function: appendFolderGen2
                        })
                    }}
                    className=" w-[35px] text-[12px] mt-2 text-white flex justify-center items-center h-[32px] bg-green-500 rounded-md"
                >
                    +
                </button>
            }

            {errors.subFoldersGen1?.[0]?.subFoldersGen2 &&
                <span className=" text-red-500 text-[12px] " >{errors.subFoldersGen1?.[0]?.subFoldersGen2.message }</span>
            }

        </div>

    );
}

export default TreeFolderGen2;
