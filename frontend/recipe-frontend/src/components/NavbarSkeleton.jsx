import { Box, Skeleton, Stack } from "@mui/material";

const NavbarSkeleton = () => {
  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Stack direction="column" alignItems="center" spacing={2}>
        {/* Top Row Skeleton */}
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={100} height={40} />
          <Skeleton variant="rounded" width={180} height={40} />
        </Stack>

        {/* Navigation Links Skeleton */}
        <Stack direction="row" spacing={5}>
          {Array(6)
            .fill("")
            .map((_, index) => (
              <Skeleton key={index} variant="text" width={80} height={20} />
            ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default NavbarSkeleton;
