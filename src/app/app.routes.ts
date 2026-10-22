import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AssistComponent } from './pages/assist/assist.component';
import { ConnectComponent } from './pages/connect/connect.component';
import { LoginComponent } from './pages/login/login.component';


//Llamado de las rutas
export const routes: Routes = [
    {path:'', component: HomeComponent, pathMatch: 'full'},
    {path:'products', component: ProductsComponent },
    {path:'assist', component: AssistComponent },
    {path:'connect', component: ConnectComponent },
    {path: 'login', component: LoginComponent },
    {path:'**', redirectTo: '' }
];
