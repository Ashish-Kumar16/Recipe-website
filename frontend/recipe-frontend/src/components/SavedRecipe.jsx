import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSavedRecipes,
  reorderRecipes,
  updateRecipeOrder,
  deleteRecipe,
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
import CloseIcon from "@mui/icons-material/Close";
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

  useEffect(() => {
    if (isAuthenticated && (status === "idle" || status === "failed")) {
      dispatch(fetchSavedRecipes())
        .unwrap()
        .catch((err) => toast.error(`Failed to load saved recipes: ${err}`));
    }
  }, [isAuthenticated, status, dispatch]);

  const handleCardClick = (recipeId) => navigate(`/recipe/${recipeId}`);

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
          sx={{
            py: 1,
            px: 1.5,
            backgroundColor: "#fff",
            mb: 1,
            borderRadius: 2,
          }}
        >
          <Skeleton variant="text" width={25} sx={{ mr: 1.5 }} />
          <ListItemAvatar>
            <Skeleton variant="rectangular" width={50} height={50} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width={150} />}
            secondary={<Skeleton variant="text" width={80} />}
          />
        </ListItem>
      ));
    }

    if (savedRecipes.length === 0 && status === "succeeded") {
      return (
        <Typography
          textAlign="center"
          sx={{ mt: 4, fontSize: { xs: "1rem", md: "1.25rem" }, color: "#666" }}
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
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 1.5 : 2,
              borderRadius: 2,
              backgroundColor: "#fff",
              mb: 1.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 1 : 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                minWidth: isMobile ? 25 : 30,
                textAlign: "center",
                fontWeight: "bold",
                color: "#34495e",
                fontSize: isMobile ? "0.9rem" : "1rem",
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
                  width: isMobile ? 50 : 80,
                  height: isMobile ? 50 : 60,
                  borderRadius: 1,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              onClick={() => handleCardClick(recipe.recipeId)}
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    color: "#34495e",
                    fontSize: isMobile ? "0.9rem" : "1.25rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {recipe.title}
                </Typography>
              }
              secondary={
                <Box
                  display="flex"
                  alignItems="center"
                  gap={isMobile ? 0.75 : 1.5}
                  mt={isMobile ? 0.25 : 0.5}
                >
                  <Chip
                    label={recipe.vegan ? "Veg" : "Non-Veg"}
                    size="small"
                    sx={{
                      backgroundColor: recipe.vegan ? "#27ae60" : "#c0392b",
                      color: "#fff",
                      fontSize: isMobile ? "0.65rem" : "0.75rem",
                      height: isMobile ? 20 : 24,
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon
                      fontSize="small"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: isMobile ? "1rem" : "1.25rem",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
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
                e.stopPropagation();
                handleDeleteRecipe(recipe._id);
              }}
              sx={{
                color: "#e74c3c",
                "&:hover": { color: "#c0392b" },
                ml: isMobile ? 0.5 : "auto",
                p: isMobile ? 0.5 : 1,
              }}
            >
              <CloseIcon fontSize={isMobile ? "small" : "medium"} />
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
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: "center",
          color: "#34495e",
          mb: { xs: 3, md: 4 },
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
                  maxWidth: { xs: "100%", sm: 700, md: 800 },
                  mx: "auto",
                  px: { xs: 0, sm: 2 },
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
        <Box textAlign="center" mt={4}>
          <Typography
            color="error"
            sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
          >
            ⚠️ {error}
          </Typography>
          <button
            style={{
              padding: "8px 16px",
              marginTop: "12px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")}
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
