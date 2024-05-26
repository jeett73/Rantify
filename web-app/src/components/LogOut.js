import BASE_URL from '../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogOut() {
    const navigate = useNavigate();
    const logOutUser = () => {
        axios.post(`${BASE_URL}/users/logout`, {}, {
            headers: {
                'authorization': localStorage.getItem("token"),
            }
        }).then(response => {
            console.log(response.data);
            if(response.data.title == "success"){
                localStorage.clear();
                navigate('/login');
            }
        }).catch(error => {
            console.log(error);
            // if (error.response.data.status == 401) {
            //     // navigate('/');
            // }
        });
    }

    return (
        <>
            <div class="modal modal-blur fade" id="modal-success" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-status bg-success"></div>
                        <div class="modal-body text-center py-4">
                            <h3>Are you sure, You want to logout?</h3>
                        </div>
                        <div class="modal-footer">
                            <div class="w-100">
                                <div class="row">
                                    <div class="col"><a href="#" class="btn w-100" data-bs-dismiss="modal">
                                        Cancel
                                    </a></div>
                                    <div class="col" onClick={logOutUser}><a href="#" class="btn btn-success w-100" data-bs-dismiss="modal">
                                        Log Out
                                    </a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LogOut;