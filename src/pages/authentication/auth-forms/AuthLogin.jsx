import PropTypes from 'prop-types';
import React, { startTransition } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import api from 'api';
import Snackbar from 'components/Snackbar';
import { useAuth } from 'hooks/use-auth';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);
  const [error, setError] = React.useState('');

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const auth = useAuth();

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: Yup.string().max(255).required('Password is required')
    }),
    onSubmit: (values) => {
      api.auth
        .login({ email: values.email, password: values.password })
        .then((response) => {
          const user = response.data.user;
          if (user.password_reset_required) {
            handleNavigation(`/reset-password?id=${user.id}`);
          } else {
            auth.saveUserToLocalStorage(user).then(() => {
              handleNavigation('/dashboard/default');
            });
          }
        })
        .catch((error) => {
          setError(error.response.data.error);
          formik.setSubmitting(false);
        });
    }
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      {error && <Snackbar message={error} severity="error" handleClose={() => setError('')} />}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-login">Email Address</InputLabel>
            <OutlinedInput
              id="email-login"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Enter email address"
              fullWidth
              error={Boolean(formik.touched.email && formik.errors.email)}
            />
          </Stack>
          {formik.touched.email && formik.errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {formik.errors.email}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-login">Password</InputLabel>
            <OutlinedInput
              fullWidth
              error={Boolean(formik.touched.password && formik.errors.password)}
              id="-password-login"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color="secondary"
                  >
                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Enter password"
            />
          </Stack>
          {formik.touched.password && formik.errors.password && (
            <FormHelperText error id="standard-weight-helper-text-password-login">
              {formik.errors.password}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sx={{ mt: -1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  name="checked"
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="h6">Keep me sign in</Typography>}
            />
            <Link variant="h6" component={RouterLink} color="text.primary">
              Forgot Password?
            </Link>
          </Stack>
        </Grid>
        {formik.errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </form>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
