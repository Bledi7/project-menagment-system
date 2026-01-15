import { Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Google, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>{/* Page Content Goes Here */}</div>
      <Container maxWidth="xl" sx={{ bgcolor: "#45526e", py: 5 }}>
        {/* Footer */}
        <footer>
          {/* Grid container */}
          <Grid container sx={{ p: 4, pb: 0 }}>
            {/* Section: Links */}
            <Grid item md={3} lg={3} xl={3} mx="auto" mt={3}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: "bold" }}>
                Company name
              </Typography>
              <Typography>
                Here you can use rows and columns to organize your footer
                content. Lorem ipsum dolor sit amet, consectetur adipisicing
                elit.
              </Typography>
            </Grid>

            <hr className="w-100 clearfix d-md-none" />

            {/* Grid column */}
            <Grid item md={2} lg={2} xl={2} mx="auto" mt={3}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: "bold" }}>
                Products
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  MDBootstrap
                </Link>
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  MDWordPress
                </Link>
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  BrandFlow
                </Link>
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  Bootstrap Angular
                </Link>
              </Typography>
            </Grid>
            {/* Grid column */}

            <hr className="w-100 clearfix d-md-none" />

            {/* Grid column */}
            <Grid item md={3} lg={2} xl={2} mx="auto" mt={3}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: "bold" }}>
                Useful links
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  Your Account
                </Link>
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  Become an Affiliate
                </Link>
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  Shipping Rates
                </Link>
              </Typography>
              <Typography>
                <Link href="#" underline="none" color="inherit">
                  Help
                </Link>
              </Typography>
            </Grid>
            {/* Grid column */}

            {/* Grid column */}
            <Grid item md={4} lg={3} xl={3} mx="auto" mt={3}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: "bold" }}>
                Contact
              </Typography>
              <Typography>
                <i className="fas fa-home mr-3"></i> New York, NY 10012, US
              </Typography>
              <Typography>
                <i className="fas fa-envelope mr-3"></i> info@gmail.com
              </Typography>
              <Typography>
                <i className="fas fa-phone mr-3"></i> + 01 234 567 88
              </Typography>
              <Typography>
                <i className="fas fa-print mr-3"></i> + 01 234 567 89
              </Typography>
            </Grid>
            {/* Grid column */}
          </Grid>
          {/* Grid container */}

          <hr className="my-3" />

          {/* Section: Copyright */}
          <section className="p-3 pt-0">
            <Grid container alignItems="center">
              {/* Grid column */}
              <Grid
                item
                md={7}
                lg={8}
                sx={{ textAlign: { xs: "center", md: "start" } }}
              >
                {/* Copyright */}
                <div style={{ padding: "3px" }}>
                  © 2020 Copyright:
                  <Link
                    href="https://mdbootstrap.com/"
                    underline="none"
                    color="inherit"
                  >
                    MDBootstrap.com
                  </Link>
                </div>
                {/* Copyright */}
              </Grid>
              {/* Grid column */}

              {/* Grid column */}
              <Grid
                item
                md={5}
                lg={4}
                ml="auto"
                sx={{ textAlign: { xs: "center", md: "end" } }}
              >
                {/* Facebook */}
                <IconButton
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  aria-label="Facebook"
                  sx={{ m: 1 }}
                >
                  <Facebook />
                </IconButton>

                {/* Twitter */}
                <IconButton
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  aria-label="Twitter"
                  sx={{ m: 1 }}
                >
                  <Twitter />
                </IconButton>

                {/* Google */}
                <IconButton
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  aria-label="Google"
                  sx={{ m: 1 }}
                >
                  <Google />
                </IconButton>

                {/* Instagram */}
                <IconButton
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  aria-label="Instagram"
                  sx={{ m: 1 }}
                >
                  <Instagram />
                </IconButton>
              </Grid>
              {/* Grid column */}
            </Grid>
          </section>
          {/* Section: Copyright */}
        </footer>
        {/* Footer */}
      </Container>
    </div>
  );
};

export default Footer;
