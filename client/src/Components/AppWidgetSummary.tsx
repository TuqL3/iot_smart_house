// @mui
import { styled } from "@mui/material/styles";
import { Card, PaletteColor, Typography, Palette } from "@mui/material";
import { ReactNode } from "react";
// utils
// components

// ----------------------------------------------------------------------

const StyledIcon = styled("div")(() => ({
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
}));

// ----------------------------------------------------------------------

interface IProps {
  color: keyof Palette;
  icon: ReactNode;
  title: string;
  total: number;
  gradientColor: string;
}

export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  gradientColor,
  ...other
}: IProps) {
  return (
    <Card
      sx={{
        boxShadow: 0,
        textAlign: "center",
        // color: (theme) => (theme.palette[color] as PaletteColor).dark,
        bgcolor: (theme) => (theme.palette[color] as PaletteColor).light,
        height: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",

        // backgroundImage: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
        backgroundImage: gradientColor,
      }}
      {...other}
    >
      <StyledIcon
        sx={
          {
            //   backgroundImage: (theme) =>
            //     `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
            //       theme.palette[color].dark,
            //       0.24
            //     )} 100%)`,
          }
        }
      >
        {icon}
      </StyledIcon>

      <Typography variant="h3" color={"white"}>
        {total}
      </Typography>

      <Typography
        variant="subtitle2"
        color={"white"}
        // sx={{ opacity: 0.72 }}
      >
        {title}
      </Typography>
    </Card>
  );
}
