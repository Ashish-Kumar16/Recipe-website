import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSavedRecipes,
  reorderRecipes,
  updateRecipeOrder,
  deleteRecipe, // New action
} from "../features/savedRecipesSlice";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Skeleton,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon for delete
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

const SavedRecipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: savedRecipes,
    status,
    error,
  } = useSelector((state) => state.savedRecipes);
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (isAuthenticated && (status === "idle" || status === "failed")) {
      dispatch(fetchSavedRecipes())
        .unwrap()
        .catch((err) => {
          toast.error(`Failed to load saved recipes: ${err}`);
        });
    }
  }, [isAuthenticated, status, dispatch]);

  const handleCardClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleDeleteRecipe = (recipeId) => {
    dispatch(deleteRecipe(recipeId))
      .unwrap()
      .then(() => toast.success("Recipe deleted successfully!"))
      .catch((err) => toast.error(`Failed to delete recipe: ${err}`));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const reorderedRecipes = Array.from(savedRecipes);
    const [movedRecipe] = reorderedRecipes.splice(sourceIndex, 1);
    reorderedRecipes.splice(destIndex, 0, movedRecipe);

    dispatch(reorderRecipes(reorderedRecipes));
    dispatch(updateRecipeOrder(reorderedRecipes))
      .unwrap()
      .then(() => toast.success("Recipes reordered successfully!"))
      .catch((err) => {
        toast.error(`Failed to save order: ${err}`);
        dispatch(reorderRecipes(savedRecipes));
      });
  };

  const renderListContent = () => {
    if (status === "loading") {
      return [...Array(5)].map((_, index) => (
        <ListItem
          key={index}
          sx={{ py: 1, flexDirection: isMobile ? "column" : "row" }}
        >
          <Skeleton
            variant="text"
            width={isMobile ? "20%" : 30}
            sx={{ mr: isMobile ? 0 : 2, mb: isMobile ? 1 : 0 }}
          />
          <ListItemAvatar>
            <Skeleton
              variant="rectangular"
              width={isMobile ? "100%" : 80}
              height={60}
            />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width={isMobile ? "80%" : 200} />}
            secondary={
              <Skeleton variant="text" width={isMobile ? "60%" : 100} />
            }
            sx={{ textAlign: isMobile ? "center" : "left" }}
          />
        </ListItem>
      ));
    }

    if (savedRecipes.length === 0 && status === "succeeded") {
      return (
        <Typography
          textAlign="center"
          sx={{ mt: 4, fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          No saved recipes yet. Start saving some delicious dishes!
        </Typography>
      );
    }

    return savedRecipes.map((recipe, index) => (
      <Draggable
        key={recipe._id}
        draggableId={recipe._id.toString()}
        index={index}
      >
        {(provided) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              py: 1,
              borderRadius: 2,
              backgroundColor: "#fff",
              mb: 1,
              boxShadow: 1,
              "&:hover": { boxShadow: 3, backgroundColor: "#f1f3f5" },
              cursor: "pointer",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "center" : "center",
              position: "relative", // For positioning the delete icon
            }}
          >
            <Typography
              variant="body1"
              sx={{
                width: isMobile ? "auto" : 30,
                textAlign: "center",
                fontWeight: "bold",
                color: "#2c3e50",
                mr: isMobile ? 0 : 2,
                mb: isMobile ? 1 : 0,
              }}
            >
              {index + 1}.
            </Typography>
            <ListItemAvatar>
              <Avatar
                variant="square"
                src={recipe.image}
                alt={recipe.title}
                sx={{
                  width: isMobile ? "100%" : isTablet ? 60 : 80,
                  height: isMobile ? 120 : 60,
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 1 : 0,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              onClick={() => handleCardClick(recipe.recipeId)}
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2c3e50",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  {recipe.title}
                </Typography>
              }
              secondary={
                <Box
                  component="span"
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  alignItems="center"
                  gap={1}
                  sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
                >
                  <Chip
                    label={recipe.vegan ? "Vegetarian" : "Non-Vegetarian"}
                    size="small"
                    sx={{
                      backgroundColor: recipe.vegan ? "#4caf50" : "#d32f2f",
                      color: "#fff",
                      mb: isMobile ? 1 : 0,
                    }}
                  />
                  <Box
                    component="span"
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                  >
                    <AccessTimeIcon
                      fontSize="small"
                      sx={{ color: "#7f8c8d" }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: { xs: "0.8rem", md: "0.875rem" },
                      }}
                    >
                      {recipe.readyInMinutes} min
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click from triggering
                handleDeleteRecipe(recipe._id);
              }}
              sx={{
                position: isMobile ? "absolute" : "relative",
                top: isMobile ? 8 : "auto",
                right: isMobile ? 8 : "auto",
                color: "#d32f2f",
                "&:hover": { color: "#b71c1c" },
                ml: isMobile ? 0 : 1,
              }}
            >
              <CloseIcon />
            </IconButton>
          </ListItem>
        )}
      </Draggable>
    ));
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#2c3e50",
          mb: { xs: 2, md: 3 },
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        🍽️ Your Saved Recipes
      </Typography>

      {!isAuthenticated ? (
        <Typography
          textAlign="center"
          color="error"
          sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
        >
          Please sign in to view your saved recipes.
        </Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="savedRecipes" direction="vertical">
            {(provided) => (
              <List
                sx={{
                  maxWidth: { xs: "100%", sm: 600, md: 600 },
                  mx: "auto",
                  px: { xs: 0, sm: 1 },
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {renderListContent()}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {status === "failed" && (
        <Box textAlign="center" mt={{ xs: 3, md: 5 }}>
          <Typography
            color="error"
            sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
          >
            ⚠️ {error}
          </Typography>
          <button
            style={{
              padding: isMobile ? "8px 16px" : "10px 20px",
              marginTop: "10px",
              backgroundColor: "#ff6f61",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
            onClick={() => dispatch(fetchSavedRecipes())}
          >
            Retry
          </button>
        </Box>
      )}
    </Box>
  );
};

export default SavedRecipes;
