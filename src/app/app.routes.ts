import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AssistComponent } from './pages/assist/assist.component';
//Llamado de las rutas
export const routes: Routes = [
    {path:'', component: HomeComponent },
    {path:'products', component: ProductsComponent },
    {path:'assist', component: AssistComponent },
    {path:'**', redirectTo: '' }
];
